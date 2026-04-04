const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when addUser is not implemented', async () => {
    const repo = new UserRepository();
    await expect(repo.addUser({})).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyAvailableUsername is not implemented', async () => {
    const repo = new UserRepository();
    await expect(repo.verifyAvailableUsername('user')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getPasswordByUsername is not implemented', async () => {
    const repo = new UserRepository();
    await expect(repo.getPasswordByUsername('user')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getIdByUsername is not implemented', async () => {
    const repo = new UserRepository();
    await expect(repo.getIdByUsername('user')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
