import jwt          from 'jsonwebtoken';
import config       from '../../config';
import { getUser }  from '../user/methods';

export function signtoken(payload){
  if(!payload) return;
  return jwt.sign(payload, config.secret, {expiresIn: '1 days'});
}

export function validatetoken(token, cb){
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return cb(err);
    return cb(null, decoded);
  });
}

export function getTokenFromHeadersOrQueryString(headers, query){
  const authToken = {};
  if(headers && headers.authorization){
    authToken.token = headers.authorization.split(' ')[1];
  }else if (query && query.auth_token) {
    authToken.token = query.auth_token;
  }
  return authToken.token;
}

export function accessLevel(role){
  return config.roles.indexOf(role);
}

export function isLoggedIn(role){
  if(!role) role = 'user';
  const accessLevelRequired = accessLevel(role);

  return function(req, res, next) {
    const authToken = getTokenFromHeadersOrQueryString(req.headers, req.query);
    //Don't allow access if token is not provided in header or queryString
    if(!authToken) return res.sendStatus(401);
    //Validate the token
    validatetoken(authToken, (err, decoded) => {
        if(err) return res.status(401).json(err);
        getUser({_id: decoded._id}, (err, user) => {
          if(err) return res.sendStatus(500);

          //don't allow access if the role is insufficient
          if(!user || !(accessLevel(user.role) >= accessLevelRequired) ) {

            return res.sendStatus(401);
          }

          user.password = null;
          req.user = user;
          return next();
        });
    });
  };
}
