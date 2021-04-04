const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const authConfig = require('../config/auth');

function generateToken(params = {}) {
    return token = jwt.sign(params, authConfig.secret, {
        expiresIn: authConfig.expiresIn
    });

}

module.exports = {
    async list(req, res) {
        try {
            const users = await User.find();

            return res.json({ result: 'Success', users });
        } catch (err) {
            res.status(400).send({ error: 'Error loading users' })
        }
    },
    async show(req, res) {
        try {
            const users = await User.findById(req.params.userId);

            return res.json({ result: 'Success', users });
        } catch (err) {
            res.status(400).send({ error: 'Error find user' })
        }
    },
    async create(req, res) {
        const { email } = req.body;
        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'User already exists' })
            }

            const user = await User.create(req.body);

            user.password = undefined;

            return res.send({
                result: 'Success',
                user,
                token: generateToken({ id: user.id })
            })
        } catch (err) {
            res.status(400).send({ error: 'Error creating new user' })
        }
    },
    async update(req, res) {
        try {
            const { name, email, password } = req.body;

            let user = await User.findById(req.params.userId);

            if (!user) {
                return res.status(400).send({ error: 'User does not exists' })
            }

            user = await User.findByIdAndUpdate(
                req.params.userId,
                {
                    name,
                    email,
                    password
                },
                {
                    new: true
                })

            user.password = undefined;

            return res.send({
                result: 'Success',
                user,
                token: generateToken({ id: user.id })
            })
        } catch (err) {
            res.status(400).send({ error: 'Error updating user' })
        }
    },
    async delete(req, res) {
        const { userId } = req.params;
        try {
            if (!await User.findById(userId)) {
                return res.status(400).send({ error: 'User does not exists' })
            }

            await User.findByIdAndRemove(userId);

            return res.send({ result: 'Success', })
        } catch (err) {
            res.status(400).send({ error: 'Error deleting user' })
        }
    },
    async authenticate(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(400).send({ error: 'User not found' })
            }

            if (! await bcryptjs.compare(password, user.password)) {
                return res.status(400).send({ error: 'Invalid password' })
            }

            user.password = undefined;

            return res.send({
                result: 'Success',
                user,
                token: generateToken({ id: user.id })
            })
        } catch (err) {
            res.status(400).send({ error: 'Error creating new user' })
        }
    },
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).send({ error: 'User not found' })
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            })

            mailer.sendMail({
                to: email,
                from: 'teste@teste.com.br',
                subject: 'Recupere sua senha',
                template: 'auth/forgot_password',
                context: { token }
            }, (err) => {
                if (err) {
                    return res.status(400).send({ error: 'Cannot send forgot password email' });
                }

                return res.send({ result: 'Success', });
            })
        } catch (err) {
            res.status(400).send({ error: 'Error on forgot password, try again' })
        }
    },
    async resetPassword(req, res) {
        try {
            const { email, password, token } = req.body;

            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }

            if (token !== user.passwordResetToken) {
                return res.status(400).send({ error: 'Token invalid' });
            }

            const now = new Date();

            if (now > user.passwordResetExpires) {
                return res.status(400).send({ error: 'Token expired, generate a new one' });
            }

            user.password = password;

            await user.save();

            res.send({ result: 'Success', });
        } catch (err) {
            res.status(400).send({ error: 'Cannot reset password, try again' });
        }
    }
};