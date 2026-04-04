const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

const handler = {
  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = request.server.app.container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({ ...request.payload, commentId, threadId, owner });

    return h.response({
      status: 'success',
      data: { addedReply },
    }).code(201);
  },

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyUseCase = request.server.app.container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

    return { status: 'success' };
  },
};

module.exports = handler;
