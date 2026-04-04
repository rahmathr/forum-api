const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when addReply is not implemented', async () => {
    const repo = new ReplyRepository();
    await expect(repo.addReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteReply is not implemented', async () => {
    const repo = new ReplyRepository();
    await expect(repo.deleteReply('id')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyReplyExists is not implemented', async () => {
    const repo = new ReplyRepository();
    await expect(repo.verifyReplyExists('id')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyReplyOwner is not implemented', async () => {
    const repo = new ReplyRepository();
    await expect(repo.verifyReplyOwner('id', 'owner')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getRepliesByCommentId is not implemented', async () => {
    const repo = new ReplyRepository();
    await expect(repo.getRepliesByCommentId('id')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
