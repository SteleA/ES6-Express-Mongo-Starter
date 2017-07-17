import mongoose from 'mongoose';
import config   from './';

mongoose.Promise = require('q').Promise;

export default () => {
  mongoose.connect(config.mongodb, {
    useMongoClient: true,
    /* other options */
  }).then(() => {
    console.log('mongodb is up and running');
  })
  .catch(console.log);
};
