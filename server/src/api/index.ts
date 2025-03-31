import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import authRoutes from './auth';
import blogRoutes from './blogs';
import emojis from './emojis';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/emojis', emojis);

export default router;