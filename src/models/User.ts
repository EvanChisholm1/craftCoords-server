import { model, Schema, Document } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

export interface UserDoc extends Document, IUser {}

const userSchema = new Schema<UserDoc>({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: 'Please supply an email',
  },
  password: {
    type: String,
    required: 'Please Supply a password',
  },
});

export default model<UserDoc>('User', userSchema);
