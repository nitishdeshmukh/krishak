import { Router } from 'express';
import { getBrewersSales, getAllBrewersSales, getBrewersSaleByDealNumber, getBrewersSaleById, createBrewersSale, updateBrewersSale, deleteBrewersSale } from '../../controllers/sales/brewersSalesController.js';

const router = Router();
router.get('/all', getAllBrewersSales);
router.get('/by-deal-number/:dealNumber', getBrewersSaleByDealNumber);
router.route('/').get(getBrewersSales).post(createBrewersSale);
router.route('/:id').get(getBrewersSaleById).put(updateBrewersSale).delete(deleteBrewersSale);
export default router;
