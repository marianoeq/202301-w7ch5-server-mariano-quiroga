import { Schema, model } from 'mongoose';
import { User } from '../entities/user.mode';

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 5, max: 12 },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  enemies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
