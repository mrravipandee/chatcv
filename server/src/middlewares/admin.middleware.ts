import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { User } from '../modules/auth/models/user.model';

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

    let role = req.user.role;
    let email = req.user.email?.toLowerCase();

    // If role or email is missing from token payload, fetch from DB
    if (!role || !email) {
      const dbUser = await User.findById(req.user.id).select('role email').lean();
      if (dbUser) {
        role = dbUser.role;
        email = dbUser.email?.toLowerCase();
        req.user.role = role;
        req.user.email = email;
      }
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
      : [];

    // Allow if role is admin OR email matches ADMIN_EMAILS
    if (role === 'admin' || (email && adminEmails.includes(email))) {
      // Set role in db if not set
      if (role !== 'admin' && req.user.id) {
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
