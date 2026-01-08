import express from 'express';
import { createTruck, getTrucks, updateTruck, deleteTruck } from '../controllers/truckController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .post(createTruck)
    .get(getTrucks);

router.route('/:id')
    .put(updateTruck)
    .delete(deleteTruck);

export default router;
