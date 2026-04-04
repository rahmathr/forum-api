const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when addComment is not implemented', async () => {
    const repo = new CommentRepository();
    await expect(repo.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteComment is not implemented', async () => {
    const repo = new CommentRepository();
    await expect(repo.deleteComment('id')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyCommentExists is not implemented', async () => {
    const repo = new CommentRepository();
    await expect(repo.verifyCommentExists('id')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyCommentOwner is not implemented', async () => {
    const repo = new CommentRepository();
    await expect(repo.verifyCommentOwner('id', 'owner')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getCommentsByThreadId is not implemented', async () => {
    const repo = new CommentRepository();
    await expect(repo.getCommentsByThreadId('id')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
