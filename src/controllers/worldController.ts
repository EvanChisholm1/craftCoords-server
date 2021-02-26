import { Request, Response } from 'express';
import { promises } from 'fs';
import { authorize } from 'passport';
import extractUser from '../lib/extractUser';
import World from '../models/World';

class WorldController {
  static async createWorld(req: Request, res: Response) {
    const user = extractUser(req);
    const world = await new World({
      ...req.body,
      owner: user?._id,
    }).save();
    res.json(world);
  }

  static async getMyWorlds(req: Request<{ page: string }>, res: Response) {
    const user = extractUser(req);

    let page = parseInt(req.params.page) || 1;
    const limit = 10;
    const skip = page * limit - limit;

    const worldsPromise = World.find()
      .where({ owner: user?._id })
      .skip(skip)
      .limit(limit)
      .sort({ name: 'desc' });

    const countPromise = World.countDocuments({ owner: user?.id });

    const [worlds, count] = await Promise.all([worldsPromise, countPromise]);
    res.json({
      count,
      worlds,
    });
  }
}

export default WorldController;
