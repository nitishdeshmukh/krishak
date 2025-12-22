/**
 * Generic CRUD Route Factory
 * Creates standard CRUD routes for any controller
 */
import { Router } from 'express';

/**
 * Create CRUD routes for a controller
 * @param {Object} controller - Controller with getAll, getById, create, update, delete methods
 * @returns {Router} Express router
 */
const createCrudRoutes = (controller) => {
    const router = Router();

    router.route('/')
        .get(controller.getAll)
        .post(controller.create);

    router.route('/:id')
        .get(controller.getById)
        .put(controller.update)
        .delete(controller.delete);

    return router;
};

export default createCrudRoutes;
