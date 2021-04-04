const express = require('express');

const projectController = require('../controllers/projectController');
const authMiddleware = require('..//middlewares/auth');

const authRouter = express.Router();

authRouter.use(authMiddleware);

authRouter.get('/', projectController.list);

authRouter.get('/', projectController.list);
authRouter.get('/:projectId', projectController.show);
authRouter.post('/', projectController.create);
authRouter.put('/:projectId', projectController.update);
authRouter.delete('/:projectId', projectController.delete);

module.exports = authRouter;