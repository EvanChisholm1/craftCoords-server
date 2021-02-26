import { Schema, model, Document } from 'mongoose';
import { UserDoc } from './User';

interface IWorld {
  name: string;
  created: Date;
  owner: UserDoc | string;
}

interface WorldDoc extends IWorld, Document {}

const worldSchema = new Schema<WorldDoc>({
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
});

export default model<WorldDoc>('World', worldSchema);
