const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');

const handler = {
  async postAuthenticationHandler(req, res, next) {
    try {
      const loginUserUseCase = req.container.getInstance(LoginUserUseCase.name);
      const { accessToken, refreshToken } = await loginUserUseCase.execute(req.body);
      return res.status(201).json({
        status: 'success',
        data: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  },

  async putAuthenticationHandler(req, res, next) {
    try {
      const refreshAuthenticationUseCase = req.container.getInstance(RefreshAuthenticationUseCase.name);
      const accessToken = await refreshAuthenticationUseCase.execute(req.body);
      return res.status(200).json({
        status: 'success',
        data: { accessToken },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteAuthenticationHandler(req, res, next) {
    try {
      const logoutUserUseCase = req.container.getInstance(LogoutUserUseCase.name);
      await logoutUserUseCase.execute(req.body);
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;
