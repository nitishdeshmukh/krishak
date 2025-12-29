import { Router } from 'express';
import { getRicePurchases, getAllRicePurchases, getRicePurchaseByNumber, getRicePurchaseById, createRicePurchase, updateRicePurchase, deleteRicePurchase } from '../../controllers/purchases/ricePurchasesController.js';

const router = Router();
router.get('/all', getAllRicePurchases);
router.get('/by-number/:purchaseNumber', getRicePurchaseByNumber);
router.route('/').get(getRicePurchases).post(createRicePurchase);
router.route('/:id').get(getRicePurchaseById).put(updateRicePurchase).delete(deleteRicePurchase);

export default router;
