const express = require('express');

const userRouter = require('./userRouter');
const projectRouter = require('./projectRouter');

const router = express.Router();


router.use('/users', userRouter);
router.use('/projects', projectRouter);


router.get('/', (req,res) => {
    res.send({ 
        app: "voss-api",
        version: "1.0.0"
     })
})

module.exports = app => app.use('/api', router);