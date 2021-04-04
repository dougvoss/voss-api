const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require("dotenv/config");


const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: 'templates',
        layoutsDir: 'templates',
        defaultLayout: '',
      },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
    defaultLayout: false,
}))

module.exports = transport;