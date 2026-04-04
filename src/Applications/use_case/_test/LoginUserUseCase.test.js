const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrate login user use case correctly', async () => {
    const useCasePayload = { username: 'dicoding', password: 'secret' };
    const expectedTokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

    const mockUserRepository = {
      getPasswordByUsername: jest.fn().mockResolvedValue('hashed_secret'),
      getIdByUsername: jest.fn().mockResolvedValue('user-123'),
    };
    const mockAuthenticationRepository = {
      addToken: jest.fn().mockResolvedValue(undefined),
    };
    const mockAuthenticationTokenManager = {
      createAccessToken: jest.fn().mockResolvedValue(expectedTokens.accessToken),
      createRefreshToken: jest.fn().mockResolvedValue(expectedTokens.refreshToken),
    };
    const mockPasswordHash = {
      comparePassword: jest.fn().mockResolvedValue(undefined),
    };

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    const tokens = await loginUserUseCase.execute(useCasePayload);

    expect(tokens).toStrictEqual(expectedTokens);
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith(useCasePayload.password, 'hashed_secret');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(expectedTokens.refreshToken);
  });
});
