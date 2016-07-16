'use strict';

const config = {};

// server mode (development or production)
config.mode = process.env.mode;

config.serverport = process.env.PORT || process.env.testPort || 3000;

config.secret = 'SuperSecrets111';

config.roles = ['guest','user','admin'];

config.appSettings = {
  appName         : 'SuperApp',
  appUSP          : 'The app that will save your life',
  email           : 'hi@superapp.com',
  url             : 'superapp.com',
  fullURL         : 'https://www.superapp.com'
};

config.emailSettings = {
  fromname    :       config.appSettings.appName,
  from        :       config.appSettings.email,
  confirmURL  :       function(){
    return config.appSettings.fullURL + '/api/user/confirm/';
  },
  resetURL  :       function(){
    return config.appSettings.fullURL + '/reset/';
  }
};

config.mailtrap = {
  username:'9924b16f8d66e4',
  password:'3a025f26b24bfe'
};

//mongodb url
config.mongodb =
  process.env.mongodb || `localhost/${config.appSettings.appName}`;

config.SENDGRIDAPIKEY = process.env.sendgrid;

export default config;
