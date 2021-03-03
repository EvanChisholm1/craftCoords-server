import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ error: { message: 'Unathorized', status: 401 } });
    req.user = user;
    next();
  })(req, res, next);
}
