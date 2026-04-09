const handler = require('./handler');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'PUT',
        path: '/threads/{threadId}/comments/{commentId}/likes',
        handler: handler.putLikeHandler,
        options: { auth: 'forumapi_jwt' },
      },
    ]);
  },
};
