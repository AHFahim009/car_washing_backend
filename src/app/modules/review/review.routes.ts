import express from 'express';
import { ReviewControllers } from './review.controllers';

const router = express.Router();

// POST: Create a new review
router.post('/reviews', ReviewControllers.createReview);

// GET: Get all reviews
router.get('/reviews', ReviewControllers.getReviews);

// GET: Get a single review by ID



export const ReviewRoutes = router
