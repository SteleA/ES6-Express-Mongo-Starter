import passport from 'passport';
import express from 'express';
import { signtoken } from '../auth';
import localPassportConfig from  './passport';


const router = express.Router();

router.post('/', (req, res, next) => {
  localPassportConfig();
    passport.authenticate('local', (err, user, info) => {
        const error = err || info;

        if (err || info) {
            return res.status(401).json(error);
        }

        if (!user) {
            return res
                    .status(404)
                    .json({message: 'Something went wrong, please try again.'});
        }

        const o = {
            _id: user._id,
            role: user.role
        };

        return res.send(signtoken(o));
    })(req, res, next);
});

export default router;
