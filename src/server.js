'use strict';

const http = require('http');

const db = require('./db');
const app = require('./app');

const server = http.createServer(app);

db.connect();
server.listen(3000);

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

// shut down server
function shutdown() {
  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    console.log('Gracefully stopping');
    process.exit();
  });
}
