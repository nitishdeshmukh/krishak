import { Router } from 'express';
import { getBrokensOutward, getBrokensOutwardById, createBrokensOutward, updateBrokensOutward, deleteBrokensOutward } from '../../controllers/outward/brokensOutwardController.js';
const router = Router();
router.route('/').get(getBrokensOutward).post(createBrokensOutward);
router.route('/:id').get(getBrokensOutwardById).put(updateBrokensOutward).delete(deleteBrokensOutward);
export default router;
