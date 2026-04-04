const handler = require('./handler');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
      },
    ]);
  },
};
