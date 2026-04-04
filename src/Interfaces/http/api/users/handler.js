const RegisterUserUseCase = require('../../../../Applications/use_case/RegisterUserUseCase');

const handler = {
  async postUserHandler(request, h) {
    const registerUserUseCase = request.server.app.container.getInstance(RegisterUserUseCase.name);
    const registeredUser = await registerUserUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: { addedUser: registeredUser },
    }).code(201);
  },
};

module.exports = handler;
