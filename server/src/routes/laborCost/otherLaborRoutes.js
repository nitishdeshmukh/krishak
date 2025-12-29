import { Router } from 'express';
import { getOtherLabor, getOtherLaborById, createOtherLabor, updateOtherLabor, deleteOtherLabor } from '../../controllers/laborCost/otherLaborController.js';

const router = Router();
router.route('/').get(getOtherLabor).post(createOtherLabor);
router.route('/:id').get(getOtherLaborById).put(updateOtherLabor).delete(deleteOtherLabor);

export default router;
