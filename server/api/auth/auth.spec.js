var mongoose = require('mongoose');

import { expect }  from 'chai';
import * as auth   from './auth';

let server;

process.env.testPort = 3500;
mongoose.models = {};
mongoose.modelSchemas = {};

describe('Auth methods', () => {
  before(function () {
    server = require('../../app').server;
  });

  after(function (done) {
    server.close(done);
  });


  const o = {};

    describe('signtoken()', () => {
      it('should fail to sign a token without payload', (done) => {
        o.token = auth.signtoken();
        expect(o.token).to.not.exist;
        done();
      });

      it('should sign a token', (done) => {
        o.token = auth.signtoken({email: 'test@email.com'});
        expect(o.token).to.exist;
        done();
      });
    });

    describe('validatetoken()', () => {
      it('should fail to validate null token', (done) => {
        auth.validatetoken(null, (err) => {
          expect(err).to.exist;
          done();
        });
      });

      it('should fail to validate bad token', (done) => {
        auth.validatetoken('bad_token', (err) => {
          expect(err).to.exist;
          done();
        });
      });

      it('should validate token', (done) => {
        auth.validatetoken(o.token, (err, results) => {
          expect(results).to.exist;
          done();
        });
      });
    });
});
