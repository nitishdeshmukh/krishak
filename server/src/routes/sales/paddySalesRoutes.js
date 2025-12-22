import { Router } from 'express';
import { getPaddySales, getPaddySaleById, createPaddySale, updatePaddySale, deletePaddySale } from '../../controllers/sales/paddySalesController.js';
const router = Router();
router.route('/').get(getPaddySales).post(createPaddySale);
router.route('/:id').get(getPaddySaleById).put(updatePaddySale).delete(deletePaddySale);
export default router;
