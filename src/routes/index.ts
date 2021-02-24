import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import AuthController from '../controllers/auth';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.send('hello world');
});

router.post(
  '/auth/register',
  body('email').isEmail(),
  body('password').exists(),
  AuthController.register
);
router.post(
  '/auth/login',
  body('email').isEmail(),
  body('password').exists(),
  AuthController.login
);

router.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req: any, res: any) => {
    res.send('hello world');
  }
);

export default router;
