/**
 * Paddy Milling Routes
 */
import { Router } from 'express';
import { getPaddyMilling, getPaddyMillingById, createPaddyMilling, updatePaddyMilling, deletePaddyMilling } from '../../controllers/milling/paddyMillingController.js';

const router = Router();

router.route('/').get(getPaddyMilling).post(createPaddyMilling);
router.route('/:id').get(getPaddyMillingById).put(updatePaddyMilling).delete(deletePaddyMilling);

export default router;
