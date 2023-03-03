import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';

const debug = createDebug('W7:index');
const PORT = process.env.PORT || 3232;

const server = http.createServer(app);

server.listen(PORT);

server.on('listening', () => {
  debug('Server listening on PORT ' + PORT);
});

server.on('error', (error) => {
  debug('server Error ' + error);
});
