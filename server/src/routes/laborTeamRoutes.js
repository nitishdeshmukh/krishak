import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
    getLaborTeams,
    getLaborTeamById,
    createLaborTeam,
    updateLaborTeam,
    deleteLaborTeam
} from '../controllers/laborTeamController.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getLaborTeams)
    .post(createLaborTeam);

router.route('/:id')
    .get(getLaborTeamById)
    .put(updateLaborTeam)
    .delete(deleteLaborTeam);

export default router;
