import express from 'express';
import authGuard from '../../middlewares/auth';
import { validateRequest } from '../../utils/validationRequest';
import { webReviewController } from './controller.webReviews';
import { webReviewValidation } from './validation.webReviews';

const router = express.Router();



router.post('/create',
    authGuard("user"),
    validateRequest(webReviewValidation.createWebReviewValidation),
    webReviewController.createWebReview);

router.patch('/update/:id',
    authGuard("user"),
    validateRequest(webReviewValidation.updateWebReviewValidation),
    webReviewController.updateWebReview);

router.delete('/delete/:id',
    authGuard("user"),
    validateRequest(webReviewValidation.updateWebReviewValidation),
    webReviewController.deleteWebReview);

router.get('/single/:id',
    authGuard("user"),
    webReviewController.getSingleWebReview);

router.get('/all',
    webReviewController.getAllWebReviews);

export const webReviewRoutes = router;