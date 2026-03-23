import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import locationRoutes from './location.routes';
import incidentRoutes from './incident.routes';
import aiRoutes from './ai.routes';
import { checkAppStatus } from '../middlewares/appStatus.middleware';

const router = Router();

// Auth Routes (Don't check app status for login/register if possible, or maybe do)
router.use('/auth', authRoutes);

// Apply app status check to ALL subsequent routes
router.use(checkAppStatus);

// User Routes
router.use('/users', userRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

// Location Routes
router.use('/locations', locationRoutes);

// Incident Routes
router.use('/incidents', incidentRoutes);

// AI Routes
router.use('/ai', aiRoutes);

// Test Route
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to CivicAI API v1' });
});

export default router;
