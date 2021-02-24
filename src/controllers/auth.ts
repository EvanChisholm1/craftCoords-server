import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

interface RegisterBody {
  email?: string;
  password?: string;
}

interface RegisterResponse {
  token?: string;
  errors: any[];
}

class AuthController {
  static async register(
    req: Request<any, any, RegisterBody>,
    res: Response<RegisterResponse>
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await genSalt(10);
    const password = await hash(req.body.password, salt);

    const user = await User.create({
      email: req.body.email,
      password,
    });

    const token = sign({ sub: user.id }, process.env.TOKEN_SECRET!);

    return res.json({
      errors: [],
      token,
    });
  }

  static async login(
    req: Request<any, any, RegisterBody>,
    res: Response<RegisterResponse>
  ) {
    console.log('running login function');
    const errors: any[] = [];
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      errors.push({
        msg: 'incorrect username or password',
      });
      return res.json({ errors });
    }

    const passwordIsValid = await compare(req.body.password, user.password);
    if (!passwordIsValid) {
      errors.push({
        msg: 'incorrect username or password',
      });
      return res.json({ errors });
    }

    const token = sign({ sub: user.id }, process.env.TOKEN_SECRET!);
    return res.json({
      errors,
      token,
    });
  }
}

export default AuthController;
