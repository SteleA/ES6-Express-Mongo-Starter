import express from 'express';
import user from './api/user';
import auth from './api/auth';

export default function(app) {

    app.use('/api/user', user);
    app.use('/api/auth', auth);

    app.use(express.static('public'));

    app.get('*', (req, res) => {
        res.sendStatus(404);
    });
}
