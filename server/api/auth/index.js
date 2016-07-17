import express from 'express';
import local from './local';

const router = express.Router();

router.use('/local', local);

export default router;
