import express from 'express';
import {
    getOutwardLabor,
    getOutwardLaborById,
    createOutwardLabor,
    updateOutwardLabor,
    deleteOutwardLabor,
} from '../../controllers/laborCost/outwardLaborController.js';
import { protect } from '../../middlewares/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .get(getOutwardLabor)
    .post(createOutwardLabor);

router.route('/:id')
    .get(getOutwardLaborById)
    .put(updateOutwardLabor)
    .delete(deleteOutwardLabor);

export default router;
