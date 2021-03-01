import { Schema, model, Document } from 'mongoose';
import { UserDoc } from './User';
import { WorldDoc } from './World';

interface ICoords {
  name: string;
  created: Date;
  owner: UserDoc | string;
  world: WorldDoc | string;
  x: number;
  y: number;
  z: number;
}

export interface CoordsDoc extends ICoords, Document {}

const coordsSchema = new Schema<CoordsDoc>({
  name: {
    type: String,
    required: 'Please enter a world name',
    default: 'World',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'You must supply a user',
  },
  world: {
    type: Schema.Types.ObjectId,
    ref: 'World',
    required: 'You must supply a world',
  },
  x: {
    type: Number,
    required: 'You must supply an X coordinate',
  },
  y: {
    type: Number,
    required: 'You must supply an X coordinate',
  },
  z: {
    type: Number,
    required: 'You must supply an X coordinate',
  },
});

export default model<CoordsDoc>('Coords', coordsSchema);
