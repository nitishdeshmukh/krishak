import { Router } from 'express';
import { getBrewersOutward, getBrewersOutwardById, createBrewersOutward, updateBrewersOutward, deleteBrewersOutward } from '../../controllers/outward/brewersOutwardController.js';
const router = Router();
router.route('/').get(getBrewersOutward).post(createBrewersOutward);
router.route('/:id').get(getBrewersOutwardById).put(updateBrewersOutward).delete(deleteBrewersOutward);
export default router;
