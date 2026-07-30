import { Router } from 'express';
import { trackVisitorController } from './visitor.controller';

const router = Router();

// Public route to capture visitor telemetry from front-end layout transitions
router.post('/track', trackVisitorController);

export default router;
