const handler = require('./handler');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthenticationHandler,
      },
      {
        method: 'PUT',
        path: '/authentications',
        handler: handler.putAuthenticationHandler,
      },
      {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.deleteAuthenticationHandler,
      },
    ]);
  },
};
