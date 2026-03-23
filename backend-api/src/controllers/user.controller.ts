import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/db';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        locations: true,
        historyLogs: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, phone, isLocationShared, profilePhotoUrl } = req.body;
    
    // Log history if profile updated
    await prisma.historyLog.create({
      data: {
        userId,
        actionType: 'PROFILE_UPDATED'
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone, isLocationShared, profilePhotoUrl }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
