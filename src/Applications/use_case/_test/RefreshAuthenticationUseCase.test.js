const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrate refresh authentication use case correctly', async () => {
    const useCasePayload = { refreshToken: 'refresh_token' };
    const newAccessToken = 'new_access_token';

    const mockAuthenticationRepository = {
      verifyRefreshToken: jest.fn().mockResolvedValue(undefined),
    };
    const mockAuthenticationTokenManager = {
      verifyRefreshToken: jest.fn().mockResolvedValue({ username: 'dicoding', id: 'user-123' }),
      createAccessToken: jest.fn().mockResolvedValue(newAccessToken),
    };

    const refreshAuthUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    const accessToken = await refreshAuthUseCase.execute(useCasePayload);

    expect(accessToken).toBe(newAccessToken);
    expect(mockAuthenticationRepository.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
  });
});
