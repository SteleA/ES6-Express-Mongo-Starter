import express          from 'express';
import * as controller  from './controller';
import { isLoggedIn }   from '../auth/auth';

const router = express.Router();

router.get('/', isLoggedIn('admin'), controller.getAllUsers);
router.get('/:id', controller.getUser);
router.post('/', controller.addNewUser);
router.put('/:id', isLoggedIn(), controller.updateUser);
router.delete('/:id', isLoggedIn(), controller.deleteUser);

router.get('/confirm/:id', controller.confirmUser);
router.get('/unsubscribe/:id', controller.unsubscribeUser);
router.get('/subscribe/:id', controller.subscribeUser);

router.post('/forgot', controller.forgotPassword);
router.post('/reset', controller.resetPassword);

export default router;
