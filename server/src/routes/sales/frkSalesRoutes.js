import { Router } from 'express';
import { getFrkSales, getFrkSaleById, createFrkSale, updateFrkSale, deleteFrkSale } from '../../controllers/sales/frkSalesController.js';
const router = Router();
router.route('/').get(getFrkSales).post(createFrkSale);
router.route('/:id').get(getFrkSaleById).put(updateFrkSale).delete(deleteFrkSale);
export default router;
