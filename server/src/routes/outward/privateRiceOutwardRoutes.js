import { Router } from 'express';
import { getPrivateRiceOutward, getPrivateRiceOutwardById, createPrivateRiceOutward, updatePrivateRiceOutward, deletePrivateRiceOutward } from '../../controllers/outward/privateRiceOutwardController.js';
const router = Router();
router.route('/').get(getPrivateRiceOutward).post(createPrivateRiceOutward);
router.route('/:id').get(getPrivateRiceOutwardById).put(updatePrivateRiceOutward).delete(deletePrivateRiceOutward);
export default router;
