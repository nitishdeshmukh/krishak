import { Router } from 'express';
import { getOtherOutward, getOtherOutwardById, createOtherOutward, updateOtherOutward, deleteOtherOutward } from '../../controllers/outward/otherOutwardController.js';
const router = Router();
router.route('/').get(getOtherOutward).post(createOtherOutward);
router.route('/:id').get(getOtherOutwardById).put(updateOtherOutward).delete(deleteOtherOutward);
export default router;
