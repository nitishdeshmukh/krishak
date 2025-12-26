import express from 'express';
import { createTruck, getTrucks, deleteTruck } from '../controllers/truckController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .post(createTruck)
    .get(getTrucks);

router.route('/:id')
    .delete(deleteTruck);

export default router;
