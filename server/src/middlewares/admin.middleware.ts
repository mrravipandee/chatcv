import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { User } from '../modules/auth/models/user.model';

const DEFAULT_ADMIN_EMAILS = ['imravipanday@gmail.com'];

const getAdminEmails = () => {
  const configuredEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];

  return [...new Set([...configuredEmails, ...DEFAULT_ADMIN_EMAILS])];
};

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access: No session user found'
      });
    }

    const adminEmails = getAdminEmails();

    const userEmail = req.user.email?.toLowerCase();

    // Allow if role is admin OR email matches ADMIN_EMAILS
    if (req.user.role === 'admin' || (userEmail && adminEmails.includes(userEmail))) {
      // Set role in db if not set
      if (req.user.role !== 'admin') {
        await User.findByIdAndUpdate(req.user.id, { role: 'admin' });
      }
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Forbidden access: Admin privileges required'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal authorization error',
      details: error.message
    });
  }
};
