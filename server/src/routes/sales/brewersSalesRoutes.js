import { Router } from 'express';
import { getBrewersSales, getBrewersSaleById, createBrewersSale, updateBrewersSale, deleteBrewersSale } from '../../controllers/sales/brewersSalesController.js';
const router = Router();
router.route('/').get(getBrewersSales).post(createBrewersSale);
router.route('/:id').get(getBrewersSaleById).put(updateBrewersSale).delete(deleteBrewersSale);
export default router;
