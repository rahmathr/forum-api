const handler = require('./handler');

module.exports = {
  name: 'comments',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
        options: { auth: 'forumapi_jwt' },
      },
      {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentHandler,
        options: { auth: 'forumapi_jwt' },
      },
    ]);
  },
};
