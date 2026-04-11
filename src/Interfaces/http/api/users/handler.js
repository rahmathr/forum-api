const RegisterUserUseCase = require('../../../../Applications/use_case/RegisterUserUseCase');

const handler = {
  async postUserHandler(req, res, next) {
    try {
      const registerUserUseCase = req.container.getInstance(RegisterUserUseCase.name);
      const registeredUser = await registerUserUseCase.execute(req.body);
      return res.status(201).json({
        status: 'success',
        data: { addedUser: registeredUser },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = handler;