const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');

const handler = {
  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = request.server.app.container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: { accessToken, refreshToken },
    }).code(201);
  },

  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = request.server.app.container.getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return {
      status: 'success',
      data: { accessToken },
    };
  },

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = request.server.app.container.getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);

    return { status: 'success' };
  },
};

module.exports = handler;
