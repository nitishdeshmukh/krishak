import { Router } from 'express';
import { getOtherSales, getAllOtherSales, getOtherSaleByDealNumber, getOtherSaleById, createOtherSale, updateOtherSale, deleteOtherSale } from '../../controllers/sales/otherSalesController.js';

const router = Router();
router.get('/all', getAllOtherSales);
router.get('/by-deal-number/:dealNumber', getOtherSaleByDealNumber);
router.route('/').get(getOtherSales).post(createOtherSale);
router.route('/:id').get(getOtherSaleById).put(updateOtherSale).delete(deleteOtherSale);
export default router;
