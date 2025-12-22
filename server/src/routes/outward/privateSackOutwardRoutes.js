import { Router } from 'express';
import { getPrivateSackOutward, getPrivateSackOutwardById, createPrivateSackOutward, updatePrivateSackOutward, deletePrivateSackOutward } from '../../controllers/outward/privateSackOutwardController.js';
const router = Router();
router.route('/').get(getPrivateSackOutward).post(createPrivateSackOutward);
router.route('/:id').get(getPrivateSackOutwardById).put(updatePrivateSackOutward).delete(deletePrivateSackOutward);
export default router;
