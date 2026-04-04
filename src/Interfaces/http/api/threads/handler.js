const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

const handler = {
  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = request.server.app.container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

    return h.response({
      status: 'success',
      data: { addedThread },
    }).code(201);
  },

  async getThreadDetailHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailUseCase = request.server.app.container.getInstance(GetThreadDetailUseCase.name);
    const thread = await getThreadDetailUseCase.execute(threadId);

    return {
      status: 'success',
      data: { thread },
    };
  },
};

module.exports = handler;
