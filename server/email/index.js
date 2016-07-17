import Sendgrid from 'sendgrid';
import hogan from 'hogan.js';
import fs from 'fs';
import config from '../config';
import nodemailer    from 'nodemailer';

if (process.env.NODE_ENV === 'test') {
  var transporter = nodemailer.createTransport("SMTP", {
    host: "mailtrap.io",
    port: 2525,
    auth: {
      user: config.mailtrap.username,
      pass: config.mailtrap.password
    }
  });
}

export function activate(opt, cb) {
    const
        template =
          fs.readFileSync(__dirname + '/templates/activate.hjs', 'utf-8'),
        compliedTemplate = hogan.compile(template),
        sendgrid = Sendgrid(process.env.sendgrid),
        callback = (err, json) => {
            if (err) return cb(err);
            cb(null, json);
        },
        mailOptions = {
            to: opt.email,
            fromname: config.emailSettings.fromName,
            from: config.emailSettings.from,
            subject: 'Confirm your account',
            html: compliedTemplate.render({
                id: opt._id,
                appName: config.appSettings.appName,
                appUSP: config.appSettings.appUSP,
                email: config.appSettings.email,
                fullURL: config.appSettings.fullURL,
                confirmURL: config.emailSettings.confirmURL
            })
        };
    if (process.env.NODE_ENV === 'test') {
      transporter.sendMail(mailOptions, callback);
    } else {
      sendgrid.send(mailOptions, callback);
    }
}

export function forgotPasswordEmail(opt, cb) {
    const
        template =
          fs.readFileSync(__dirname + '/templates/forgot.hjs', 'utf-8'),
        compliedTemplate = hogan.compile(template),
        sendgrid = Sendgrid(process.env.sendgrid),
        mailOptions = {
            to: opt.email,
            fromname: config.emailSettings.fromName,
            from: config.emailSettings.from,
            subject: 'Restore your password',
            html: compliedTemplate.render({
                token: opt.token,
                appName: config.appSettings.appName,
                appUSP: config.appSettings.appUSP,
                email: config.appSettings.email,
                fullURL: config.appSettings.fullURL,
                resetURL: config.emailSettings.resetURL
            })
        },
        callback = (err, json) => {
            if (err) return cb(err);
            cb(null, json);
        };
    if (process.env.NODE_ENV === 'test') {
      transporter.sendMail(mailOptions, callback);
    } else {
      sendgrid.send(mailOptions, callback);
    }
}
export function resetPassword(opt, cb) {
    const
        template =
          fs.readFileSync(__dirname + '/templates/reset.hjs', 'utf-8'),
        compliedTemplate = hogan.compile(template),
        sendgrid = Sendgrid(process.env.sendgrid),
        mailOptions = {
            to: opt.email,
            fromname: config.emailSettings.fromName,
            from: config.emailSettings.from,
            subject: 'Your password has been changed',
            html: compliedTemplate.render({
                token: opt.token,
                appName: config.appSettings.appName,
                appUSP: config.appSettings.appUSP,
                email: config.appSettings.email,
                fullURL: config.appSettings.fullURL
            })
        },
        callback = (err, json) => {
            if (err) return cb(err);
            cb(null, json);
        };
    if (process.env.NODE_ENV === 'test') {
      transporter.sendMail(mailOptions, callback);
    } else {
      sendgrid.send(mailOptions, callback);
    }
}
