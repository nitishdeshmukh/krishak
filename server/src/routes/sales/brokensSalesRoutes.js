import { Router } from 'express';
import { getBrokensSales, getBrokensSaleById, createBrokensSale, updateBrokensSale, deleteBrokensSale } from '../../controllers/sales/brokensSalesController.js';
const router = Router();
router.route('/').get(getBrokensSales).post(createBrokensSale);
router.route('/:id').get(getBrokensSaleById).put(updateBrokensSale).delete(deleteBrokensSale);
export default router;
