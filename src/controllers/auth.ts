import { NextFunction, Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import { HttpError } from '../lib/errors';
import extractUser from '../lib/extractUser';

interface RegisterBody {
  email?: string;
  password?: string;
}

interface RegisterResponse {
  token?: string;
}

class AuthController {
  static async register(
    req: Request<any, any, RegisterBody>,
    res: Response<RegisterResponse>
  ) {
    const salt = await genSalt(10);
    const password = await hash(req.body.password, salt);

    const user = await User.create({
      email: req.body.email,
      password,
    });

    const token = sign({ sub: user.id }, process.env.TOKEN_SECRET!);

    return res.json({
      token,
    });
  }

  static async login(
    req: Request<any, any, RegisterBody>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new HttpError('incorrect email or password', 400);
    }

    const passwordIsValid = await compare(req.body.password, user.password);
    if (!passwordIsValid) {
      throw new HttpError('incorrect email or password', 400);
    }

    const token = sign({ sub: user.id }, process.env.TOKEN_SECRET!);
    return res.json({
      token,
    });
  }

  static async me(req: Request, res: Response) {
    const user = extractUser(req);
    res.json({
      user: {
        email: user?.email,
        _id: user?.id,
      },
    });
  }
}

export default AuthController;
