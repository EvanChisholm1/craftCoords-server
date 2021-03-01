import Coords from '../models/Coords';
import { Request, Response } from 'express';
import extractUser from '../lib/extractUser';

class coordsController {
  static async addCoords(
    req: Request<
      { id: string },
      any,
      { x: number; y: number; z: number; name: string }
    >,
    res: Response
  ) {
    const user = extractUser(req);
    const worldId = req.params.id;
    const coords = new Coords({
      ...req.body,
      owner: user?._id,
      world: worldId,
    });
    await coords.save();

    res.json(coords);
  }
}

export default coordsController;
