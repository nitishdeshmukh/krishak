/**
 * Transporters Routes
 */
import { Router } from 'express';
import { getTransporters, getTransporterById, createTransporter, updateTransporter, deleteTransporter } from '../controllers/transportersController.js';

const router = Router();

router.route('/').get(getTransporters).post(createTransporter);
router.route('/:id').get(getTransporterById).put(updateTransporter).delete(deleteTransporter);

export default router;
