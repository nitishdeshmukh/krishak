import { Router } from 'express';
import { getSackSales, getAllSackSales, getSackSaleByDealNumber, getSackSaleById, createSackSale, updateSackSale, deleteSackSale } from '../../controllers/sales/sackSalesController.js';

const router = Router();
router.get('/all', getAllSackSales);
router.get('/by-deal-number/:dealNumber', getSackSaleByDealNumber);
router.route('/').get(getSackSales).post(createSackSale);
router.route('/:id').get(getSackSaleById).put(updateSackSale).delete(deleteSackSale);
export default router;
