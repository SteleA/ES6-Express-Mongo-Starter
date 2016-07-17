
import { expect }   from 'chai';
import * as methods         from './methods';
import User                 from './model';
import request              from 'supertest';

// addUser(user, cb)
// subscribe(id, cb)
// unsubscribe(id, cb)
// confirm(id, cb)
// getActiveUsers(cb)
// getUsers(options, cb)
// getUser(options, cb)
// updateUser(options,cb)
// forgotPassword(options, cb)

describe('User methods', () => {
  const
  user = {
    email: 'test1132d@email.com',
    firstName: 'Alex',
    password: 'test123'
  },
  user2 = {
    email: 'test1132d2admin@email.com',
    role: 'admin'
  },
  user3 = {
    email: 'test1132d2user@email.com',
    role: 'user'
  };

  before((done) => {
    User.findOneAndRemove({email:user.email}, done);
  });
  before((done) => {
    User.findOneAndRemove(user2, (err) =>{
      if(err) return done(err);
      let newUser = new User(user2);
      newUser.save((err, user) => {
        if(err) done(err);
        user2._id = user._id;
        done();
      });
    });
  });
  before((done) => {
    User.findOneAndRemove(user3, (err) =>{
      if(err) return done(err);
      let newUser = new User(user3);
      newUser.save((err, user) => {
        if(err) done(err);
        user3._id = user._id;
        done();
      });
    });
  });



  describe('addUser()', () => {
    it('should fail to add a user without email', (done) => {
      methods.addUser({}, (err) => {
        if(err) return done(null, err);
      });
    });

    it('should add a user', (done) => {
        methods.addUser(user, (err, result) => {
          if(err) return done(err);
          user._id = result._id;
          done();
        });
    });

    it('should fail to add a user with the same email', (done) => {
      methods.addUser(user, (err) => {
        if(err) return done(null, err);
      });
    });
  });

  describe('updateUser()', () => {
    it('should update a user', (done) => {
      methods.updateUser({
        update: {
          firstName:'Ana',
          password: '111'
        },
        _id: user._id,
        user: user
      }, (err, user) => {
        if(err) return done(err);
        expect(user.firstName).to.equal('Ana');
        done();
      });
    });
    it('should return true with updated password', (done) => {
      User.findOne({_id: user._id}, (err, res) => {
        if(err) return done(err);
        expect(res.validPassword('111')).to.equal(true);
        done();
      });
    });
    it('should update a user as admin', (done) => {
      methods.updateUser({
        update: {
          firstName:'Ana',
          password: 'test123'
        },
        _id: user._id,
        user: user2
      }, (err, user) => {
        if(err) return done(err);
        expect(user.firstName).to.equal('Ana');
        done();
      });
    });
    it('a user should fail to update another user', (done) => {
      methods.updateUser({
        update: {
          firstName:'Ana',
          password: 'test123'
        },
        _id: user._id,
        user: user3
      }, (err, user) => {
        if(err) return done();
        done(user);
      });
    });
  });

  describe('confirm()', () => {

    it('should fail to confirm a user without id', (done) => {
      methods.confirm(null, (err) => {
        if(err) return done(null, err);
      });
    });

    it('should confirm a user', (done) => {
      methods.confirm(user._id, (err, user) => {
        if(err) return done(err);
        expect(user.active).to.equal(true);
        done();
      });
    });
  });

  describe('getActiveUsers()', () => {
    it('should get a list of active users', (done) => {
      methods.getActiveUsers((err, users) => {
        if(err) return done(err);
        expect(users[0].active).to.be.true;
        expect(users).to.be.a('array');
        done();
      });
    });
  });

  describe('unsubscribe()', () => {
    it('should fail to unsubscribe a user without id', (done) => {
      methods.unsubscribe(null, (err) => {
        if(err) return done(null, err);
      });
    });

    it('should unsubscribe a user', (done) => {
      methods.unsubscribe(user._id, (err, user) => {
        if(err) return done(err);
        expect(user.subscribed).to.equal(false);
        done();
      });
    });
  });

  describe('subscribe()', () => {
    it('should fail to subscribe a user without id', (done) => {
      methods.subscribe(null, (err) => {
        if(err) return done(null, err);
      });
    });

    it('should subscribe a user', (done) => {
      methods.subscribe(user._id, (err, user) => {
        if(err) return done(err);
        expect(user.subscribed).to.equal(true);
        done();
      });
    });
  });

  describe('getUsers()', () => {
    it('should get a list of users', (done) => {
      methods.getUsers({}, (err, users) => {
        if(err) return done(err);
        expect(users).to.be.a('array');
        expect(users.length > 0).to.be.true;
        done();
      });
    });
  });

  describe('getUser()', () => {
    it('should get a user', (done) => {
      methods.getUser({email: user.email}, (err) => {
        if(err) return done(err);
        done();
      });
    });
  });

  describe('deleteUser()', () => {
    it('should fail to delete a user', (done) => {
      methods.deleteUser({}, (err, res) => {
        if(err) return done();
        done(res);
      });
    });

    it('an user should not be able to delete another user', (done) => {
      methods.deleteUser({_id: user._id, user:user3}, (err, res) => {
        if(err)return done();
        done(res);
      });
    });

    it('an admin should be able to delete another user', (done) => {
      methods.deleteUser({_id: user._id, user:user2}, (err) => {
        if(err)return done(err);
        done();
      });
    });

    it('should delete a user', (done) => {
      methods.deleteUser({_id: user3._id, user:user3}, done);
    });

    it('should fail to delete a deleted user', (done) => {
      methods.deleteUser({_id: user3._id, user:user3}, (err, res) => {
        if(err) return done();
        done(res);
      });
    });
  });
  describe('forgotPassword()', () => {
    it('should fail to send forgot password email', (done) => {
      methods.forgotPassword({email: 'random111@email.com'}, (err) => {
        if(err) return done();
        done();
      });
    });
    it('should send forgot password email', (done) => {
      methods.forgotPassword({email: user2.email}, (err) => {
        if(err) return done(err);
        done();
      });
    });
  });
  describe('database', () => {
    it('should be in db', (done) => {
      methods.getUser({email: user2.email}, (err, u) => {
        if(err) return done(err);
        user.user2 = u;
        done();
      });
    });
  });

  describe('resetPassword()', () => {
    it('should fail to find user with invalid token', (done) => {
      methods.validateResetPasswordToken({token: '111'}, (err, user) => {
        if(err) return done();
        done(user);
      });
    });
    it('should validate token', (done) => {
      methods.validateResetPasswordToken({token: user.user2.token}, (err) => {
        if(err) return done(err);
        done();
      });
    });
    it('should change password', (done) => {
      methods.resetPassword({
        token         : user.user2.token,
        newPassword   : 'test123'
      }, (err) => {
        if(err) return done(err);
        done();
      });
    });
    it('should login with new password', (done) => {
      request(require('../../app').server)
        .post('/api/auth/local')
        .type('form')
        .send({
          "username": user.user2.email,
          "password": "test123"
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if(err) return done(err);
          if(res.error) return done(res.error);
          done();
      });
    });
  });
});
