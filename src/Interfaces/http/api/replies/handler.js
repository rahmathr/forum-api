const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

const handler = {
  async postReplyHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const addReplyUseCase = req.container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute({ ...req.body, commentId, threadId, owner });
      return res.status(201).json({
        status: 'success',
        data: { addedReply },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteReplyHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId, replyId } = req.params;
      const deleteReplyUseCase = req.container.getInstance(DeleteReplyUseCase.name);
      await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;