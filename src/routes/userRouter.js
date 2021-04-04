const express = require('express');

const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', userController.list);
userRouter.get('/:userId', userController.show);
userRouter.post('/', userController.create);
userRouter.put('/:userId', userController.update);
userRouter.delete('/:userId', userController.delete);

userRouter.post('/authenticate', userController.authenticate);
userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.post('/resetPassword', userController.resetPassword);

module.exports = userRouter;