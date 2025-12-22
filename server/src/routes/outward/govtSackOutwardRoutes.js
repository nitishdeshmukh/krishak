import { Router } from 'express';
import { getGovtSackOutward, getGovtSackOutwardById, createGovtSackOutward, updateGovtSackOutward, deleteGovtSackOutward } from '../../controllers/outward/govtSackOutwardController.js';
const router = Router();
router.route('/').get(getGovtSackOutward).post(createGovtSackOutward);
router.route('/:id').get(getGovtSackOutwardById).put(updateGovtSackOutward).delete(deleteGovtSackOutward);
export default router;
