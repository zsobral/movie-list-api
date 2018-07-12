'use strict';

const mongoose = require('mongoose');

const delay = require('./utils/delay');

mongoose.connection.on('error', async (err) => {
  console.log('mongo connection error');
  await delay(1000 * 5);
  await connect();
});

mongoose.connection.once('open', () => {
  console.log('mongo connected');
});

async function connect () {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      reconnectTries: Number.MAX_VALUE
    });
    return mongoose.connection;
  } catch (error) {
  }
};

module.exports = {
  connection: mongoose.connection,
  connect
};
