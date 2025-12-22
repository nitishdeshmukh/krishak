import { Router } from 'express';
import { getPrivateInward, getPrivateInwardById, createPrivateInward, updatePrivateInward, deletePrivateInward } from '../../controllers/inward/privateInwardController.js';
const router = Router();
router.route('/').get(getPrivateInward).post(createPrivateInward);
router.route('/:id').get(getPrivateInwardById).put(updatePrivateInward).delete(deletePrivateInward);
export default router;
