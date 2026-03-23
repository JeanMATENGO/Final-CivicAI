import { Router } from 'express';
import { saveLocation, getLocation } from '../controllers/location.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, saveLocation);
router.get('/', authenticate, getLocation);

export default router;
