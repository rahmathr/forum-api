const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when addToken is not implemented', async () => {
    const repo = new AuthenticationRepository();
    await expect(repo.addToken('token')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when checkAvailabilityToken is not implemented', async () => {
    const repo = new AuthenticationRepository();
    await expect(repo.checkAvailabilityToken('token')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyRefreshToken is not implemented', async () => {
    const repo = new AuthenticationRepository();
    await expect(repo.verifyRefreshToken('token')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteToken is not implemented', async () => {
    const repo = new AuthenticationRepository();
    await expect(repo.deleteToken('token')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
