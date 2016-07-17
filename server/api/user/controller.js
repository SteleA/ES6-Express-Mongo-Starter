import * as methods from './methods';

export function getAllUsers (req, res, next) {
  methods.getUsers(req.query, (err, users) => {
    if(err) return next(err);
    res.send(users);
  });
}

export function getUser (req, res, next) {
  methods.getUser({_id: req.params.id}, (err, users) => {
    if(err) return next(err);
    res.send(users);
  });
}

export function addNewUser (req, res, next) {
  methods.addUser(req.body, (err, newUser) => {
    if(err) return next(err);
    res.send(newUser);
  });
}

export function updateUser (req, res, next) {
  methods.updateUser({
    update: req.body, user: req.user, _id: req.params.id}, (err, users) => {
    if(err) return next(err);
    res.send(users);
  });
}


export function deleteUser (req, res, next) {
  methods.deleteUser({_id: req.params.id, user:req.user}, (err, users) => {
    if(err) return next(err);
    res.send(users);
  });
}

export function confirmUser (req, res, next) {
  methods.confirm(req.params.id, (err, user) => {
    if(err) return next(err);
    res.send(user);
  });
}

export function unsubscribeUser (req, res, next) {
  methods.unsubscribe(req.params.id, (err, user) => {
    if(err) return next(err);
    res.send(user);
  });
}

export function subscribeUser (req, res, next) {
  methods.subscribe(req.params.id, (err, user) => {
    if(err) return next(err);
    res.send(user);
  });
}

export function forgotPassword (req, res, next) {
  methods.forgotPassword(req.body, (err, user) => {
    if(err) return next(err);
    res.send(user);
  });
}

export function resetPassword (req, res, next) {
  methods.resetPassword(req.body, (err, user) => {
    if(err) return next(err);
    res.send(user);
  });
}
