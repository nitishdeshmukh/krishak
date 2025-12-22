import { Router } from 'express';
import { getRiceInward, getRiceInwardById, createRiceInward, updateRiceInward, deleteRiceInward } from '../../controllers/inward/riceInwardController.js';
const router = Router();
router.route('/').get(getRiceInward).post(createRiceInward);
router.route('/:id').get(getRiceInwardById).put(updateRiceInward).delete(deleteRiceInward);
export default router;
