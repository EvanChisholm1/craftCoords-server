import { Request } from 'express';
import { UserDoc } from '../models/User';

function extractUser(
  req: Request<any, any, any, any, any>
): UserDoc | undefined {
  return (req as any).user;
}

export default extractUser;
