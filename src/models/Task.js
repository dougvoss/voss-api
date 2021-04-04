const mongoose = require('../database');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    status: {
        type: String,
        enum : ['TO DO', 'WORKING', 'DONE'],
        default: 'TO DO'
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

TaskSchema.pre('save', async function (next) {
    this.completed = this.status === 'DONE';
    

    next();
})

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;