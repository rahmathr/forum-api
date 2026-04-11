const ToggleLikeUseCase = require('../../../../Applications/use_case/ToggleLikeUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

const handler = {
  async putLikeHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const { threadId, commentId } = req.params;
      const toggleLikeUseCase = req.container.getInstance(ToggleLikeUseCase.name);
      await toggleLikeUseCase.execute(threadId, commentId, owner);
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;