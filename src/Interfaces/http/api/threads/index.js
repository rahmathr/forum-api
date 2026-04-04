const handler = require('./handler');

module.exports = {
  name: 'threads',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: { auth: 'forumapi_jwt' },
      },
      {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getThreadDetailHandler,
      },
    ]);
  },
};
