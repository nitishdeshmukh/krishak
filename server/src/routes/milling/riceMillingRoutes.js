/**
 * Rice Milling Routes
 */
import { Router } from 'express';
import { getRiceMilling, getRiceMillingById, createRiceMilling, updateRiceMilling, deleteRiceMilling } from '../../controllers/milling/riceMillingController.js';

const router = Router();

router.route('/').get(getRiceMilling).post(createRiceMilling);
router.route('/:id').get(getRiceMillingById).put(updateRiceMilling).delete(deleteRiceMilling);

export default router;
