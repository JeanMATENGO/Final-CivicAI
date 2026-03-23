import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthRequest } from './auth.middleware';

export const checkAppStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Skip check for admins
    if (req.user?.role === 'ADMIN' || req.user?.email === 'jeanmatengo5@gmail.com') {
      return next();
    }

    const config = await prisma.appConfig.findUnique({
      where: { id: 'global' },
    });

    // If config doesn't exist, assume it's active
    if (!config || config.isAppActive) {
      return next();
    }

    res.status(503).json({ 
      error: 'Application temporairement désactivée par l\'administrateur.',
      status: 'MAINTENANCE'
    });
  } catch (error) {
    next(); // Proceed if DB check fails to avoid blocking the app
  }
};
