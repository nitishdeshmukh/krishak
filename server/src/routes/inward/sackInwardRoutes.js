import { Router } from 'express';
import { getSackInward, getSackInwardById, createSackInward, updateSackInward, deleteSackInward } from '../../controllers/inward/sackInwardController.js';
const router = Router();
router.route('/').get(getSackInward).post(createSackInward);
router.route('/:id').get(getSackInwardById).put(updateSackInward).delete(deleteSackInward);
export default router;
