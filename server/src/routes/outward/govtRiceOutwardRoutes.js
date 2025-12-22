import { Router } from 'express';
import { getGovtRiceOutward, getGovtRiceOutwardById, createGovtRiceOutward, updateGovtRiceOutward, deleteGovtRiceOutward } from '../../controllers/outward/govtRiceOutwardController.js';
const router = Router();
router.route('/').get(getGovtRiceOutward).post(createGovtRiceOutward);
router.route('/:id').get(getGovtRiceOutwardById).put(updateGovtRiceOutward).delete(deleteGovtRiceOutward);
export default router;
