const mongoose = require('../database');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        require: true,
    },
    adress: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    age: {
        type: Number
    },
    birthDate: {
        type: Date
    },
    identityNumber: {
        type: Number
    },
    email: {
        type: String,
        require: true,  
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },  
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


UserSchema.pre('save', async function (next) {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;