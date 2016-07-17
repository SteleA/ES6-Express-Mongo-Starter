'use strict';

import * as email from './';
const avilableTemplates = Object.keys(email);

export function sendEmails(opt, cb){

  if(!opt) return cb('options param missing');
  if(!opt.users) return cb('opt.users missing');
  if(!opt.template) return cb('opt.template missing');
  if(avilableTemplates.indexOf(opt.template) === -1) {
    return cb('template not found');
  }
  if(!Array.isArray(opt.users)) return cb('opt.users is not an array');

  function sendEmail(index) {
    if(!index) index = 0;
    if(index >= opt.users.length) return cb(null, 'Success');

    email[opt.template](opt.users[index], () => sendEmail(index+1));
  }

  sendEmail();

}
