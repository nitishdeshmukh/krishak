import { Router } from 'express';
import { getAllLotNumbers, getRiceInward, getRiceInwardById, createRiceInward, updateRiceInward, deleteRiceInward } from '../../controllers/inward/riceInwardController.js';
const router = Router();
router.get('/lot-numbers', getAllLotNumbers);
router.route('/').get(getRiceInward).post(createRiceInward);
router.route('/:id').get(getRiceInwardById).put(updateRiceInward).delete(deleteRiceInward);
export default router;
