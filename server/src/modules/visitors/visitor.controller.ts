import { Request, Response } from 'express';
import { VisitorSession } from './visitor.model';
import { parseUserAgent } from '../../utils/ua-parser';
import { getGeoIpProfile } from '../../utils/geoip';

export const trackVisitorController = async (req: Request, res: Response) => {
  try {
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
      return res.status(400).json({ success: false, message: 'sessionId and path are required' });
    }

    // 1. Resolve IP and User Agent
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ip = Array.isArray(rawIp) ? rawIp[0] : (rawIp as string).split(',')[0].trim();
    const uaString = req.headers['user-agent'] || '';
    const uaInfo = parseUserAgent(uaString);

    // 2. Resolve Geolocation Profile
    const geo = getGeoIpProfile(ip);

    // 3. Search for existing session
    let session = await VisitorSession.findOne({ ip, createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } }); // 30 minutes window

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newEvent = {
      id: eventId,
      action: action || 'Page View',
      path,
      timestamp: timestampStr,
      detail
    };

    if (session) {
      // Update existing session
      if (!session.pagesVisited.includes(path)) {
        session.pagesVisited.push(path);
      }
      session.exitPage = path;
      session.timeline.push(newEvent as any);
      
      if (action === 'Click' || action === 'Compile PDF' || action === 'Download') {
        session.clicks += 1;
      }
      
      if (scrollPercentage !== undefined) {
        session.scrollPercentage = Math.max(session.scrollPercentage, scrollPercentage);
      }

      // Calculate duration
      const durationSec = Math.floor((Date.now() - session.createdAt.getTime()) / 1000);
      session.sessionDurationSeconds = durationSec;
      session.sessionDuration = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;

      await session.save();
    } else {
      // Determine if returning user (user has visited in the past before this session)
      const pastSession = await VisitorSession.findOne({ ip, createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } });
      const userType = pastSession ? 'Returning' : 'New';

      session = await VisitorSession.create({
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
        timeline: [newEvent]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Telemetry logged successfully',
      data: {
        sessionId: session._id,
        ip: session.ip,
        city: session.city,
        country: session.country,
      }
    });
  } catch (error: any) {
    console.error('[Telemetry Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record visitor telemetry',
      details: error.message
    });
  }
};
