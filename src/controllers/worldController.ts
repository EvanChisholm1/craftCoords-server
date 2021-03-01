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

  static async getMyWorlds(
    req: Request<any, any, any, { page: string }>,
    res: Response
  ) {
    const user = extractUser(req);

    let page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = page * limit - limit;

    const worldsPromise = World.find()
      .where({ owner: user?._id })
      .skip(skip)
      .limit(limit)
      .sort({ name: 'desc' });

    const countPromise = World.countDocuments({ owner: user?.id });

    const [worlds, count] = await Promise.all([worldsPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    res.json({
      count,
      worlds,
      pages,
      page,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const skip = page * limit - limit;

    const id = req.params.id;

    const worldPromise = World.findOne({ _id: id, owner: user?._id }).populate({
      path: 'coords',
      limit: limit,
      skip: skip,
    });
    const countPromise = Coords.countDocuments({ world: id });
    const [world, count] = await Promise.all([worldPromise, countPromise]);
    const pages = Math.ceil(count / limit);

    res.json({ world, count, page, pages });
  }
}

export default WorldController;
