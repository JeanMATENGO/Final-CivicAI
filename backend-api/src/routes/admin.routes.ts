import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { getStats, getAllUsers, getAppConfig, updateAppConfig } from '../controllers/admin.controller';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// Dashboard Dashboard Stats
router.get('/dashboard', getStats);

// Gérer les utilisateurs
router.get('/users', getAllUsers);

// App Config
router.get('/config', getAppConfig);
router.patch('/config', updateAppConfig);

export default router;
