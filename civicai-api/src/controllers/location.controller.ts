import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/db';
import { isWithinRDC } from '../utils/geo';

export const saveLocation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    let { latitude, longitude, city, territory, village, region } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Restriction RDC Uniquement
    if (!isWithinRDC(latitude, longitude)) {
      return res.status(403).json({ 
        error: 'CivicAI n\'est disponible qu\'en République Démocratique du Congo (RDC).',
        code: 'OUTSIDE_RDC'
      });
    }

    // Prototype: Simulation du géocodage inversé pour la RDC
    if (!city) {
      if (latitude > -3 && latitude < -2 && longitude > 28 && longitude < 30) {
          city = 'Bukavu';
          region = 'Sud-Kivu';
          territory = 'Ibanda';
          village = 'Panzi';
      }
      else if (latitude > -4 && latitude < -3 && longitude > 28.5 && longitude < 29.5) {
          city = 'Uvira';
          region = 'Sud-Kivu';
          territory = 'Uvira City';
      }
      else if (latitude > -2 && latitude < -1 && longitude > 29 && longitude < 30) {
          city = 'Goma';
          region = 'Nord-Kivu';
          territory = 'Karisimbi';
      }
      else if (latitude > -1.5 && latitude < -0.5 && longitude > 28 && longitude < 29) {
          city = 'Masisi';
          region = 'Nord-Kivu';
          territory = 'Masisi';
      }
      else if (latitude > -5 && latitude < -4 && longitude > 15 && longitude < 16) {
          city = 'Kinshasa';
          region = 'Kinshasa';
          territory = 'Gombe / Lingwala';
      }
      else if (latitude > -12 && latitude < -11 && longitude > 27 && longitude < 28) {
          city = 'Lubumbashi';
          region = 'Haut-Katanga';
          territory = 'Lubumbashi Centre';
      }
      else if (latitude > 0.5 && latitude < 1.0 && longitude > 25 && longitude < 26) {
          city = 'Kisangani';
          region = 'Tshopo';
          territory = 'Makiso';
      }
      else {
          city = 'Congo (RDC)';
          region = region || 'Province';
          territory = territory || 'Territoire Rural';
      }
    }

    const location = await prisma.location.upsert({
      where: { userId: userId },
      update: { latitude, longitude, city, territory, village, region },
      create: { userId, latitude, longitude, city, territory, village, region }
    });

    // Log history
    await prisma.historyLog.create({
      data: {
        userId,
        actionType: 'LOCATION_UPDATED',
        metadata: { city, latitude, longitude },
      },
    });

    res.json(location);
  } catch (error) {
    console.error('Save location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLocation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const location = await prisma.location.findUnique({
      where: { userId: userId }
    });

    if (!location) return res.status(404).json({ error: 'Location not set' });

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
