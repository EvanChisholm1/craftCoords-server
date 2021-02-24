import { userInfo } from 'os';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../models/User';
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromHeader('auth_token'),
      secretOrKey: process.env.TOKEN_SECRET,
    },
    async function (payload, done) {
      try {
        const user = await User.findById(payload.sub);
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);
