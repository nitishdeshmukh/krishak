import { Router } from 'express';
import { getMillingLabor, getMillingLaborById, createMillingLabor, updateMillingLabor, deleteMillingLabor } from '../../controllers/laborCost/millingLaborController.js';

const router = Router();
router.route('/').get(getMillingLabor).post(createMillingLabor);
router.route('/:id').get(getMillingLaborById).put(updateMillingLabor).delete(deleteMillingLabor);

export default router;
