import { Schema, model, Document } from 'mongoose';
import { UserDoc } from './User';
import { CoordsDoc } from './Coords';

export interface IWorld {
  name: string;
  created: Date;
  owner: UserDoc | string;
  coords: CoordsDoc[] | undefined;
}

export interface WorldDoc extends IWorld, Document {}

const worldSchema = new Schema<WorldDoc>(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

worldSchema.virtual('coords', {
  ref: 'Coords',
  localField: '_id',
  foreignField: 'world',
});

export default model<WorldDoc>('World', worldSchema);
