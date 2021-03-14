import { Request, Response } from 'express';
import { HttpError } from '../lib/errors';
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

  static async getWorldCoords(req: Request, res: Response) {
    const user = extractUser(req);
    const id = req.params.id;

    const world = await World.findOne({ _id: id, owner: user?._id }).populate({
      path: 'coords',
    });

    res.json({ coords: world?.coords, worldName: world?.name });
  }

  static async deleteWorld(req: Request<{ id?: string }>, res: Response) {
    const id = req.params.id;
    const user = extractUser(req);
    if (!id) throw new HttpError('World id is undefined', 400);

    const world = await World.findOne({ _id: id, owner: user?._id });
    if (!world)
      throw new HttpError(
        `World with id: ${id} does not exist and could not be deleted`,
        400
      );
    const { name } = world;
    await world.delete();

    res.json({
      message: `successfully deleted world: ${name}`,
      status: 200,
    });
  }
}

export default WorldController;
