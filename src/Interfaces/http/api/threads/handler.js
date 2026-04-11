const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

const handler = {
  async postThreadHandler(req, res, next) {
    try {
      if (!req.auth) throw new AuthenticationError('Missing authentication');
      const { id: owner } = req.auth.credentials;
      const addThreadUseCase = req.container.getInstance(AddThreadUseCase.name);
      const addedThread = await addThreadUseCase.execute({ ...req.body, owner });
      return res.status(201).json({
        status: 'success',
        data: { addedThread },
      });
    } catch (err) {
      next(err);
    }
  },

  async getThreadDetailHandler(req, res, next) {
    try {
      const { threadId } = req.params;
      const getThreadDetailUseCase = req.container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(threadId);
      return res.status(200).json({
        status: 'success',
        data: { thread },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;