import express from 'express';
import { explorerController } from './controller.explorer';

const router = express.Router();



router.get('/home',
    explorerController.fetchHome);

export const explorerRoutes = router;