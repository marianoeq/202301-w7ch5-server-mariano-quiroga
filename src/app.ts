import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createDebug from 'debug';
import { usersRouter } from './router/users.router.js';
import cors from 'cors';

const debug = createDebug('W7CH5:app');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: Error, _req: Request, resp: Response, next: NextFunction) => {
    const status = 500;
    const statusMessage = 'Internal server error';

    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);

app.use('*', (_req, resp, next) => {
  resp
    .status(404)
    .send(
      `<h1>Sorry, the path is not valid. Did you mean "http://localhost:5050/users/"?<h1>`
    );
  next();
});
