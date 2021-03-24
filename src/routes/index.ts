import { Router } from 'express';
import { body, param, query } from 'express-validator';
import authenticate from '../lib/authenticate';
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
router.get('/me', authenticate, AuthController.me);

// world api routes
router.post(
  '/worlds',
  authenticate,
  body('name').exists().isString(),
  handleValidationsErrors,
  catchErrors(WorldController.createWorld)
);
router.get(
  '/worlds',
  authenticate,
  handleValidationsErrors,
  catchErrors(WorldController.getMyWorlds)
);
router.get('/world/:id', authenticate, catchErrors(WorldController.getWorld));
router.delete(
  '/world/:id',
  authenticate,
  catchErrors(WorldController.deleteWorld)
);
router.get(
  '/world/:id/coords',
  authenticate,
  catchErrors(WorldController.getWorldCoords)
);

//routes for the coords;
router.post(
  '/coords/:id',
  authenticate,
  catchErrors(coordsController.addCoords)
);
router.delete(
  '/coords/:id',
  authenticate,
  catchErrors(coordsController.deleteCoords)
);

// a route to test jwt auth
//TODO: delete route
router.get('/secret', authenticate, (req: any, res: any) => {
  res.send('hello world');
});

export default router;
