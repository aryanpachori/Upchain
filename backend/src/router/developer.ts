import { Router } from 'express';

const router = Router();

router.post('/signin', (req, res) => {
  res.json({ message: 'hi from dev' });
});

export default router;
