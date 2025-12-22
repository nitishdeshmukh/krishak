import { Router } from 'express';
import { getPrivatePaddyOutward, getPrivatePaddyOutwardById, createPrivatePaddyOutward, updatePrivatePaddyOutward, deletePrivatePaddyOutward } from '../../controllers/outward/privatePaddyOutwardController.js';
const router = Router();
router.route('/').get(getPrivatePaddyOutward).post(createPrivatePaddyOutward);
router.route('/:id').get(getPrivatePaddyOutwardById).put(updatePrivatePaddyOutward).delete(deletePrivatePaddyOutward);
export default router;
