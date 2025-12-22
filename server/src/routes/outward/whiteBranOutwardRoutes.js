import { Router } from 'express';
import { getWhiteBranOutward, getWhiteBranOutwardById, createWhiteBranOutward, updateWhiteBranOutward, deleteWhiteBranOutward } from '../../controllers/outward/whiteBranOutwardController.js';
const router = Router();
router.route('/').get(getWhiteBranOutward).post(createWhiteBranOutward);
router.route('/:id').get(getWhiteBranOutwardById).put(updateWhiteBranOutward).delete(deleteWhiteBranOutward);
export default router;
