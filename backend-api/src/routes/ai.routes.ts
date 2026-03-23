import { Router } from 'express';
import { askAI } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/ask', authenticate, askAI);

export default router;
