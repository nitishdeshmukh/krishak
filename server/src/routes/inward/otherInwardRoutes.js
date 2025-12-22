import { Router } from 'express';
import { getOtherInward, getOtherInwardById, createOtherInward, updateOtherInward, deleteOtherInward } from '../../controllers/inward/otherInwardController.js';
const router = Router();
router.route('/').get(getOtherInward).post(createOtherInward);
router.route('/:id').get(getOtherInwardById).put(updateOtherInward).delete(deleteOtherInward);
export default router;
