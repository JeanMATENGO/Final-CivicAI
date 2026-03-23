import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/db';

export const createIncident = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { type, latitude, longitude, description, photoUrl, severity } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const incident = await prisma.incident.create({
      data: {
        reporterId: userId,
        type,
        latitude,
        longitude,
        description,
        photoUrl,
        severity: severity || 'MEDIUM',
      },
    });

    // Log history
    await prisma.historyLog.create({
      data: {
        userId,
        actionType: 'INCIDENT_REPORTED',
        metadata: { incidentId: incident.id, type },
      },
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIncidents = async (req: AuthRequest, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { name: true, profilePhotoUrl: true },
        },
      },
    });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIncidentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { name: true, profilePhotoUrl: true },
        },
      },
    });

    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
