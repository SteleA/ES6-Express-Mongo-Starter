import passport                      from 'passport';
import { Strategy }                  from 'passport-local';
import User                          from '../../user/model';

export default function () {
  passport.use(new Strategy(
      (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
  ));
}
