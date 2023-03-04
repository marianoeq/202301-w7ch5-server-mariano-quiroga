import express, { Request, Response } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';

export const app = express();

app.disable('x-powered-by');
const debug = createDebug('W7:app');
const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.use((error: Error, _req: Request, res: Response) => {
  debug('soy el middleware de errores');
  const status = 500;
  const statusMessage = 'Internal server error';
  res.json([
    {
      error: [
        {
          status,
          statusMessage,
        },
      ],
    },
  ]);
  debug(status, statusMessage, error.message);
});
