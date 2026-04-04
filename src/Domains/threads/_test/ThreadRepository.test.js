const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when method addThread is not implemented', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when method verifyThreadExists is not implemented', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.verifyThreadExists('id')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when method getThreadById is not implemented', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.getThreadById('id')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
