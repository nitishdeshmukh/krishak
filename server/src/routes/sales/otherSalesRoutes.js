import { Router } from 'express';
import { getOtherSales, getOtherSaleById, createOtherSale, updateOtherSale, deleteOtherSale } from '../../controllers/sales/otherSalesController.js';
const router = Router();
router.route('/').get(getOtherSales).post(createOtherSale);
router.route('/:id').get(getOtherSaleById).put(updateOtherSale).delete(deleteOtherSale);
export default router;
