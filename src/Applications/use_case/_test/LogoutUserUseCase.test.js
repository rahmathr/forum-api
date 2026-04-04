const LogoutUserUseCase = require('../LogoutUserUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('LogoutUserUseCase', () => {
  it('should orchestrate logout use case correctly', async () => {
    const useCasePayload = { refreshToken: 'refresh_token' };

    const mockAuthenticationRepository = {
      checkAvailabilityToken: jest.fn().mockResolvedValue(undefined),
      deleteToken: jest.fn().mockResolvedValue(undefined),
    };

    const logoutUserUseCase = new LogoutUserUseCase({ authenticationRepository: mockAuthenticationRepository });
    await logoutUserUseCase.execute(useCasePayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });

  it('should throw InvariantError when refresh token is not found', async () => {
    const mockAuthenticationRepository = {
      checkAvailabilityToken: jest.fn().mockRejectedValue(new InvariantError('refresh token tidak ditemukan di database')),
      deleteToken: jest.fn(),
    };

    const logoutUserUseCase = new LogoutUserUseCase({ authenticationRepository: mockAuthenticationRepository });
    await expect(logoutUserUseCase.execute({ refreshToken: 'invalid_token' })).rejects.toThrow(InvariantError);
    expect(mockAuthenticationRepository.deleteToken).not.toHaveBeenCalled();
  });
});
