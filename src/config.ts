import dotenv from 'dotenv';

dotenv.config();

export const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
};
