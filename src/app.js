require('dotenv').config();
const createServer = require('./Infrastructure/http/server');
const container = require('./Infrastructure/http/container');

const start = async () => {
  const app = createServer(container);
  const port = process.env.PORT || 5000;
  const host = process.env.HOST || 'localhost';

  app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
};

start();
