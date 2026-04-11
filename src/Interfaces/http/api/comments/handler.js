const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

const handler = {
  async postCommentHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const { threadId } = req.params;
      const addCommentUseCase = req.container.getInstance(AddCommentUseCase.name);
      const addedComment = await addCommentUseCase.execute({ ...req.body, threadId, owner });
      return res.status(201).json({
        status: 'success',
        data: { addedComment },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteCommentHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const deleteCommentUseCase = req.container.getInstance(DeleteCommentUseCase.name);
      await deleteCommentUseCase.execute({ threadId, commentId, owner });
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;