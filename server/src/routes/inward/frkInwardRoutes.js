import { Router } from 'express';
import { getFrkInward, getFrkInwardById, createFrkInward, updateFrkInward, deleteFrkInward } from '../../controllers/inward/frkInwardController.js';
const router = Router();
router.route('/').get(getFrkInward).post(createFrkInward);
router.route('/:id').get(getFrkInwardById).put(updateFrkInward).delete(deleteFrkInward);
export default router;
