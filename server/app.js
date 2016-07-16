import dotenv        from 'dotenv';
import express       from 'express';
import cors          from 'cors';
import errorHandling from './error';
import router        from './router';
import mongodb       from './config/database';
import bodyParser    from 'body-parser';
import passport      from 'passport';
import runTasks      from './tasks';

export const app = express();
dotenv.config();

/* eslint-disable no-alert, no-console */
export const server =
  app.listen(process.env.PORT || process.env.testPort || 3000, () => {
    if(process.env.testPort) return;
    /* istanbul ignore next */
    console.info('\n=-=-= Launching App =-=-=');
    /* istanbul ignore next */
    console.info(`Server running in ${process.env.mode} mode on port
      ${process.env.PORT || process.env.testPort || 3000}`);
});
/* eslint-enable no-alert, no-console */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(cors());
mongodb();
router(app);
errorHandling(app);

/* istanbul ignore if */
if(!process.env.testPort){
  runTasks();
}
