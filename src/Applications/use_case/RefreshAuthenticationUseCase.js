class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute({ refreshToken }) {
    await this._authenticationRepository.verifyRefreshToken(refreshToken);
    const { username, id } = await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    return this._authenticationTokenManager.createAccessToken({ username, id });
  }
}

module.exports = RefreshAuthenticationUseCase;
