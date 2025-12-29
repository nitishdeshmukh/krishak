import { Router } from 'express';
import { getInwardLabor, getInwardLaborById, createInwardLabor, updateInwardLabor, deleteInwardLabor } from '../../controllers/laborCost/inwardLaborController.js';

const router = Router();
router.route('/').get(getInwardLabor).post(createInwardLabor);
router.route('/:id').get(getInwardLaborById).put(updateInwardLabor).delete(deleteInwardLabor);

export default router;
