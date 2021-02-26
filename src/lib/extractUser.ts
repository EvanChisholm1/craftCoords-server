import { Request } from 'express';
import { UserDoc } from '../models/User';

function extractUser(req: Request): UserDoc | undefined {
  return (req as any).user;
}

export default extractUser;
