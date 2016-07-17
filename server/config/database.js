import mongoose from 'mongoose';
import config   from './';

export default () => {
  mongoose.connect(config.mongodb, () => {
    if(process.env.testPort) return;
    /* eslint-disable no-alert, no-console */
    /* istanbul ignore next */
    console.log(`Mongodb up and running`);
    /* eslint-disable no-alert, no-console */
  });
};
