const handler = require('./handler');

module.exports = {
  name: 'replies',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postReplyHandler,
        options: { auth: 'forumapi_jwt' },
      },
      {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteReplyHandler,
        options: { auth: 'forumapi_jwt' },
      },
    ]);
  },
};
