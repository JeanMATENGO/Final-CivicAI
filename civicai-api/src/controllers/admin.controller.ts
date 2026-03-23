import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/db';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const incidentCount = await prisma.incident.count();
    
    // Get recent incidents
    const recentIncidents = await prisma.incident.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { reporter: { select: { name: true, email: true } } }
    });

    res.json({
      users: userCount,
      incidents: incidentCount,
      recentIncidents
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAppConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await prisma.appConfig.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global', isAppActive: true },
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAppConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { isAppActive } = req.body;
    const config = await prisma.appConfig.upsert({
      where: { id: 'global' },
      update: { isAppActive },
      create: { id: 'global', isAppActive },
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        phone: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
