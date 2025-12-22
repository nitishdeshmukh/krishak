import { Router } from 'express';
import { getHuskOutward, getHuskOutwardById, createHuskOutward, updateHuskOutward, deleteHuskOutward } from '../../controllers/outward/huskOutwardController.js';
const router = Router();
router.route('/').get(getHuskOutward).post(createHuskOutward);
router.route('/:id').get(getHuskOutwardById).put(updateHuskOutward).delete(deleteHuskOutward);
export default router;
