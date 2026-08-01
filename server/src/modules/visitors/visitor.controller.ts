import { Request, Response } from 'express';
import { VisitorSession } from './visitor.model';
import { parseUserAgent } from '../../utils/ua-parser';
import { getGeoIpProfile } from '../../utils/geoip';
import { asyncHandler } from '../../utils/asyncHandler';
import { BadRequestError } from '../../errors/BadRequestError';
import { redisClient } from '../../config/redis.client';

export const trackVisitorController = asyncHandler(async (req: Request, res: Response) => {
  const {
    sessionId,
    path,
    referrer,
    screenResolution,
    language,
    darkMode,
    connectionType,
    utmSource,
    utmMedium,
    utmCampaign,
    scrollPercentage,
    action,
    detail
  } = req.body;

  if (!sessionId || !path) {
    throw new BadRequestError('sessionId and path are required');
  }

  const redisKey = `chatcv:visitor:session:${sessionId}`;
  let sessionData: any = null;
  let isNewSession = false;

  // 1. Try to fetch the session from Redis cache
  if (redisClient) {
    try {
      const cached = await redisClient.get(redisKey);
      if (cached) {
        sessionData = JSON.parse(cached);
      }
    } catch (err) {
      console.warn('[Redis] Error fetching visitor session cache:', err);
    }
  }

  // 2. Cache Miss: Query MongoDB
  if (!sessionData) {
    const sessionDoc = await VisitorSession.findOne({ sessionId }).lean();
    if (sessionDoc) {
      sessionData = sessionDoc;
    }
  }

  const timestampStr = new Date().toLocaleTimeString('en-US', { hour12: false });
  const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newEvent = {
    id: eventId,
    action: action || 'Page View',
    path,
    timestamp: timestampStr,
    detail
  };

  // 3. Cache & DB Miss: Initialize a new session
  if (!sessionData) {
    isNewSession = true;
    
    // Resolve IP, User Agent and Geolocation
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ip = Array.isArray(rawIp) ? rawIp[0] : (rawIp as string).split(',')[0].trim();
    const uaString = req.headers['user-agent'] || '';
    const uaInfo = parseUserAgent(uaString);
    const geo = getGeoIpProfile(ip);

    // Determine if returning user (check MongoDB for past sessions from the same IP)
    const pastSession = await VisitorSession.findOne({ ip, sessionId: { $ne: sessionId } }).lean();
    const userType = pastSession ? 'Returning' : 'New';

    const now = new Date();
    sessionData = {
      sessionId,
      ip,
      country: geo.country,
      state: geo.state,
      city: geo.city,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
      isp: geo.isp,
      browser: uaInfo.browser,
      browserVersion: uaInfo.browserVersion,
      operatingSystem: uaInfo.operatingSystem,
      screenResolution: screenResolution || 'Unknown',
      deviceType: uaInfo.deviceType,
      language: language || 'en',
      darkMode: !!darkMode,
      connectionType: connectionType || 'Unknown',
      referrer: referrer || 'Direct',
      landingPage: path,
      exitPage: path,
      sessionDuration: '0m 00s',
      sessionDurationSeconds: 0,
      pagesVisited: [path],
      clicks: action === 'Click' ? 1 : 0,
      scrollPercentage: scrollPercentage || 0,
      utmSource,
      utmMedium,
      utmCampaign,
      userType,
      isBot: uaInfo.isBot,
      timeline: [newEvent],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  } else {
    // 4. Update existing session
    if (!sessionData.pagesVisited.includes(path)) {
      sessionData.pagesVisited.push(path);
    }
    sessionData.exitPage = path;
    sessionData.timeline.push(newEvent);

    if (action === 'Click' || action === 'Compile PDF' || action === 'Download') {
      sessionData.clicks = (sessionData.clicks || 0) + 1;
    }

    if (scrollPercentage !== undefined) {
      sessionData.scrollPercentage = Math.max(sessionData.scrollPercentage || 0, scrollPercentage);
    }

    // Calculate session duration based on createdAt timestamp
    const createdAtTime = new Date(sessionData.createdAt).getTime();
    const durationSec = Math.max(0, Math.floor((Date.now() - createdAtTime) / 1000));
    sessionData.sessionDurationSeconds = durationSec;
    sessionData.sessionDuration = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;
    sessionData.updatedAt = new Date().toISOString();
  }

  // 5. Update Redis cache with 30 minutes TTL (1800s)
  if (redisClient) {
    try {
      await redisClient.setex(redisKey, 1800, JSON.stringify(sessionData));
    } catch (err) {
      console.warn('[Redis] Failed to write visitor session cache:', err);
    }
  }

  // 6. Asynchronous Non-blocking DB write
  VisitorSession.findOneAndUpdate(
    { sessionId },
    sessionData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).catch((err) => {
    console.error('[DB Error] Non-blocking visitor session update failed:', err);
  });

  // 7. Respond immediately to keep response time minimal (< 5ms)
  return res.status(200).json({
    success: true,
    message: 'Telemetry logged successfully',
    data: {
      sessionId: sessionData.sessionId,
      ip: sessionData.ip,
      city: sessionData.city,
      country: sessionData.country,
    }
  });
});
