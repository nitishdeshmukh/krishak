import { Router } from 'express';
import { getBrokensSales, getAllBrokensSales, getBrokensSaleByDealNumber, getBrokensSaleById, createBrokensSale, updateBrokensSale, deleteBrokensSale } from '../../controllers/sales/brokensSalesController.js';

const router = Router();
router.get('/all', getAllBrokensSales);
router.get('/by-deal-number/:dealNumber', getBrokensSaleByDealNumber);
router.route('/').get(getBrokensSales).post(createBrokensSale);
router.route('/:id').get(getBrokensSaleById).put(updateBrokensSale).delete(deleteBrokensSale);
export default router;
