import { Request, Response } from 'express';
import { promises } from 'fs';
import { authorize } from 'passport';
import Coords from '../models/Coords';
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

  static async getMyWorlds(req: Request, res: Response) {
    const user = extractUser(req);

    const worlds = await World.find()
      .where({ owner: user?._id })
      .sort({ name: 'desc' });

    res.json({
      worlds,
    });
  }

  static async getWorld(req: Request<{ id: string }>, res: Response) {
    const user = extractUser(req);

    const id = req.params.id;
    const world = await World.findOne({ _id: id, owner: user?._id });
    res.json(world);
  }

  static async getWorldCoords(
    req: Request<any, any, any, { page: string }>,
    res: Response
  ) {
    const user = extractUser(req);

    const id = req.params.id;

    const world = await World.findOne({ _id: id, owner: user?._id }).populate({
      path: 'coords',
    });

    res.json({ world });
  }
}

export default WorldController;
