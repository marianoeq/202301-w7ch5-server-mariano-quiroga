import mongoose from 'mongoose';
import { config } from '../config';

const { username, password, cluster, dbName } = config;

export const dbConnect = () => {
  const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
