import User                from './model';
import moment              from 'moment';
import {
  activate,
  forgotPasswordEmail,
  resetPassword as resetPasswordEmail
} from '../../email';
import randomstring from 'randomstring';

export function getUsers (options, cb){
  User.find({}, {password:0}, (err, users) =>{
    if(err) return cb(err);
    return cb(null, users);
  });
}

export function getUser (options, cb){
  User.findOne(options, (err, user) =>{
    if(err) return cb(err);
    return cb(null, user);
  });
}

export function updateUser (opt, cb){

  let update = {
    firstName: opt.update.firstName,
    lastName: opt.update.lastName,
    email: opt.update.email,
    subscribed: opt.update.subscribed,
    password: opt.update.password
  };

  for (var variable in update) {
    if (update.hasOwnProperty(variable)) {
      if(!update[variable]) {
        delete update[variable];
      }
    }
  }

  if(opt.user._id == opt._id || opt.user.role === 'admin'){
    User.findOne({_id: opt._id}, (err, user) =>{
      if(err) return cb(err);
      if(update.password) {
        update.password = user.hashPassword({password: opt.update.password});
      }

      const newUser = Object.assign(user, update);

      newUser.save((err, newauser) => {
        if(err) return cb(err);
        cb(null, newauser);
      });
    });
  }else {
    return cb({status: 401, message: 'not authorized'});
  }
}

export function getActiveUsers (cb){
  User.find({active: true}, (err, users) => {
    if(err) return cb(err);
    return cb(null, users);
  });
}

export function addUser (user, cb) {
  var newUser = new User(user);
  newUser.hashPassword({password: user.password});
  getUser({email: user.email}, (err, user) =>{
    if(user) {
      return cb({status: 422, message: 'username taken'});
    }

    newUser.save((err) => {
      if(err) return cb(err);
      activate(newUser, (err) => {
        if(
          err ===
            'getaddrinfo ENOTFOUND api.sendgrid.com api.sendgrid.com:443') {
          return cb(null, newUser);
        }
        if(err && process.env.sendgrid) return cb(err);
        cb(null, newUser);
      });
    });
  });
}

export function confirm (id, cb) {
  User.findOne({_id: id}, (err, user) => {
    if(err) return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});

    user.active = true;
    user.save((err) => {
      if(err) return cb(err);
      cb(null, user);
    });
  });
}

export function unsubscribe (id, cb) {
  User.findOne({_id: id}, (err, user) => {
    if(err)   return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});
    user.subscribed = false;

    user.save((err) => {
      if(err) return cb(err);
      cb(null, user);
    });
  });
}

export function subscribe (id, cb) {
  User.findOne({_id: id}, (err, user) => {
    if(err)   return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});
    user.subscribed = true;

    user.save((err) => {
      if(err) return cb(err);
      cb(null, user);
    });
  });
}

export function deleteUser (user, cb) {
  if(!user || !user._id) {
    return cb({status: 422, message: 'missing userid'});
  }

  if(user.user._id === user._id || user.user.role === 'admin'){
    User.findOneAndRemove({_id: user._id}, (err, user) => {
      if(err) return cb(err);
      if(!user) {
        return cb({status: 404, message: 'user not found'});
      }
      return cb(null, user);
    });
  }else {
    return cb({status: 401, message: 'not authorized'});
  }
}

export function forgotPassword({ email }, cb) {
  User.findOne({email}, (err, user) => {
    if(err)   return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});

    user.token = randomstring.generate(20);
    user.tokenExpires = moment().add(3, 'hours').format('X');

    user.save((err, user) => {
      if(err) return cb(err);

      forgotPasswordEmail({token: user.token, email: user.email}, (err) => {
        if(err) return cb(err);
        return cb(null, user);
      });

    });
  });

}

export function validateResetPasswordToken({ token }, cb) {
  User.findOne({token}, (err, user) => {
    if(err)   return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});

    const
      now = moment(),
      tokenExpires = moment(new Date(user.tokenExpires*1000)),
      diff = tokenExpires.diff(now);

    if(diff < 0) return cb({status: 400, message: 'token has expired'});
    return cb(null);
  });
}

export function resetPassword({ token, newPassword }, cb) {
  User.findOne({token}, (err, user) => {
    if(err)   return cb(err);
    if(!user) return cb({status: 404, message: 'user not found'});

    const
      now = moment(),
      tokenExpires = moment(new Date(user.tokenExpires*1000)),
      diff = tokenExpires.diff(now);

    if(diff < 0) return cb({status: 400, message: 'token has expired'});

    updateUser({
      _id: user._id,
      user: {
        _id       : user._id
      },
      update: {
        password  : newPassword
      }
    }, (err) => {
      if (err) return cb(err);
      resetPasswordEmail({email: user.email}, (err) => {
        if(err) return cb(err);
        return cb(null, user);
      });
    });
  });
}
