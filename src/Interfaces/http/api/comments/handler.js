const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

const handler = {
  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentUseCase = request.server.app.container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ ...request.payload, threadId, owner });

    return h.response({
      status: 'success',
      data: { addedComment },
    }).code(201);
  },

  async deleteCommentHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = request.server.app.container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return { status: 'success' };
  },
};

module.exports = handler;
