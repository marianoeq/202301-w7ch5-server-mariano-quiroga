import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const debug = createDebug('W7:index');
const PORT = process.env.PORT || 3232;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error' + error);
  });

server.on('listening', () => {
  debug('Server listening on PORT ' + PORT);
});

server.on('error', (error) => {
  debug('server Error ' + error);
});
