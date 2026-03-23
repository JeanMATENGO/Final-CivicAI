import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createIncident, getIncidents, getIncidentById } from '../controllers/incident.controller';

const router = Router();

router.post('/', authenticate, createIncident);
router.get('/', authenticate, getIncidents);
router.get('/:id', authenticate, getIncidentById);

export default router;
