import { Router } from 'express';
import { body, param, query } from 'express-validator';
import passport from 'passport';
import coordsController from '../controllers/coordsController';
import AuthController from '../controllers/auth';
import WorldController from '../controllers/worldController';
import { catchErrors, handleValidationsErrors } from '../lib/errors';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.send('hello world');
});

// authentaction routes
router.post(
  '/auth/register',
  body('email').isEmail(),
  body('password').exists(),
  handleValidationsErrors,
  catchErrors(AuthController.register)
);
router.post(
  '/auth/login',
  body('email').isEmail(),
  body('password').exists(),
  handleValidationsErrors,
  catchErrors(AuthController.login)
);

// world api routes
router.post(
  '/worlds/create',
  passport.authenticate('jwt', { session: false }),
  body('name').exists().isString(),
  handleValidationsErrors,
  catchErrors(WorldController.createWorld)
);
router.get(
  '/worlds',
  passport.authenticate('jwt', { session: false }),
  query('page').exists().isInt(),
  handleValidationsErrors,
  catchErrors(WorldController.getMyWorlds)
);
router.get(
  '/world/:id',
  passport.authenticate('jwt', { session: false }),
  param('id').exists().isString(),
  catchErrors(WorldController.getWorld)
);
router.get(
  '/world/:id/coords',
  passport.authenticate('jwt', { session: false }),
  catchErrors(WorldController.getWorldCoords)
);

router.post(
  '/coords/:id',
  passport.authenticate('jwt', { session: false }),
  catchErrors(coordsController.addCoords)
);

// a route to test jwt auth
//TODO: delete route
router.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req: any, res: any) => {
    res.send('hello world');
  }
);

export default router;
