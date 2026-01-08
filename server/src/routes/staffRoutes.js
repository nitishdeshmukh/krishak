import express from 'express';
import { createStaff, getStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .post(createStaff)
    .get(getStaff);

router.route('/:id')
    .put(updateStaff)
    .delete(deleteStaff);

export default router;
