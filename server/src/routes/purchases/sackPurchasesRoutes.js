import { Router } from 'express';
import { getSackPurchases, getAllSackPurchases, getSackPurchaseByNumber, getSackPurchaseById, createSackPurchase, updateSackPurchase, deleteSackPurchase } from '../../controllers/purchases/sackPurchasesController.js';

const router = Router();
router.route('/').get(getSackPurchases).post(createSackPurchase);
router.route('/all').get(getAllSackPurchases);
router.route('/by-number/:purchaseNumber').get(getSackPurchaseByNumber);
router.route('/:id').get(getSackPurchaseById).put(updateSackPurchase).delete(deleteSackPurchase);
export default router;
