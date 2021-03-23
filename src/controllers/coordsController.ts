import Coords from '../models/Coords';
import { Request, Response } from 'express';
import extractUser from '../lib/extractUser';
import { HttpError } from '../lib/errors';

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
    console.log(req.body);
    const coords = new Coords({
      ...req.body,
      owner: user?._id,
      world: worldId,
    });
    await coords.save();

    res.json(coords);
  }

  static async deleteCoords(req: Request<{ id?: string }>, res: Response) {
    const id = req.params.id;
    const user = extractUser(req);
    if (!id) throw new HttpError('Location id is undefined', 400);

    const location = await Coords.findOne({ _id: id, owner: user?._id });
    if (!location)
      throw new HttpError(
        `Locaiton with id: ${id} does not exist and could not be deleted`,
        400
      );

    await location.delete();

    res.json({
      message: `successfully deleted location: ${location.name}`,
      status: 200,
    });
  }
}

export default coordsController;
