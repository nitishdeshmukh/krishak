import { Router } from 'express';
import { getRiceBranOutward, getRiceBranOutwardById, createRiceBranOutward, updateRiceBranOutward, deleteRiceBranOutward } from '../../controllers/outward/riceBranOutwardController.js';
const router = Router();
router.route('/').get(getRiceBranOutward).post(createRiceBranOutward);
router.route('/:id').get(getRiceBranOutwardById).put(updateRiceBranOutward).delete(deleteRiceBranOutward);
export default router;
