const ToggleLikeUseCase = require('../../../../Applications/use_case/ToggleLikeUseCase');

const handler = {
  async putLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const toggleLikeUseCase = request.server.app.container.getInstance(ToggleLikeUseCase.name);
    await toggleLikeUseCase.execute(threadId, commentId, owner);
    return h.response({ status: 'success' }).code(200);
  },
};

module.exports = handler;
