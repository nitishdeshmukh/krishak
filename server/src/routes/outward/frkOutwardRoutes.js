import { Router } from 'express';
import { getFrkOutward, getFrkOutwardById, createFrkOutward, updateFrkOutward, deleteFrkOutward } from '../../controllers/outward/frkOutwardController.js';
const router = Router();
router.route('/').get(getFrkOutward).post(createFrkOutward);
router.route('/:id').get(getFrkOutwardById).put(updateFrkOutward).delete(deleteFrkOutward);
export default router;
