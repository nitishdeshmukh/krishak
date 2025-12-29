import { Router } from 'express';
import { getFrkSales, getAllFrkSales, getFrkSaleByDealNumber, getFrkSaleById, createFrkSale, updateFrkSale, deleteFrkSale } from '../../controllers/sales/frkSalesController.js';

const router = Router();
router.get('/all', getAllFrkSales);
router.get('/by-deal-number/:dealNumber', getFrkSaleByDealNumber);
router.route('/').get(getFrkSales).post(createFrkSale);
router.route('/:id').get(getFrkSaleById).put(updateFrkSale).delete(deleteFrkSale);
export default router;
