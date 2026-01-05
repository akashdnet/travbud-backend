import express from 'express';
import { explorerController } from './controller.explorer';

const router = express.Router();



router.get('/home',
    explorerController.fetchHome);

router.post('/subscribe',
    explorerController.subscribe);

export const explorerRoutes = router;