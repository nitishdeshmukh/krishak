import { Router } from 'express';
import { getAllPaddySales, getPaddySaleBySaleNumber, getPaddySales, getPaddySaleById, createPaddySale, updatePaddySale, deletePaddySale } from '../../controllers/sales/paddySalesController.js';
const router = Router();
router.get('/all', getAllPaddySales);
router.get('/by-number/:saleNumber', getPaddySaleBySaleNumber);
router.route('/').get(getPaddySales).post(createPaddySale);
router.route('/:id').get(getPaddySaleById).put(updatePaddySale).delete(deletePaddySale);
export default router;
