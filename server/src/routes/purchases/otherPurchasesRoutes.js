import { Router } from 'express';
import { getOtherPurchases, getAllOtherPurchases, getOtherPurchaseById, createOtherPurchase, updateOtherPurchase, deleteOtherPurchase } from '../../controllers/purchases/otherPurchasesController.js';

const router = Router();
router.route('/all').get(getAllOtherPurchases);
router.route('/').get(getOtherPurchases).post(createOtherPurchase);
router.route('/:id').get(getOtherPurchaseById).put(updateOtherPurchase).delete(deleteOtherPurchase);
export default router;
