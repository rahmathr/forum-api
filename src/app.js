require('dotenv').config();
const createServer = require('./Infrastructure/http/server');
const container = require('./Infrastructure/http/container');

const start = async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();
