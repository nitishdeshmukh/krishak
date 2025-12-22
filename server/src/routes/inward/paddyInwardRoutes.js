import { Router } from 'express';
import { getPaddyInward, getPaddyInwardById, createPaddyInward, updatePaddyInward, deletePaddyInward } from '../../controllers/inward/paddyInwardController.js';
const router = Router();
router.route('/').get(getPaddyInward).post(createPaddyInward);
router.route('/gov').post(createPaddyInward); // Government paddy inward endpoint
router.route('/:id').get(getPaddyInwardById).put(updatePaddyInward).delete(deletePaddyInward);
export default router;

