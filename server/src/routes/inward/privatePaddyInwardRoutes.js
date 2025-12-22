import { Router } from 'express';
import { getPrivatePaddyInward, getPrivatePaddyInwardById, createPrivatePaddyInward, updatePrivatePaddyInward, deletePrivatePaddyInward } from '../../controllers/inward/privatePaddyInwardController.js';
const router = Router();
router.route('/').get(getPrivatePaddyInward).post(createPrivatePaddyInward);
router.route('/:id').get(getPrivatePaddyInwardById).put(updatePrivatePaddyInward).delete(deletePrivatePaddyInward);
export default router;
