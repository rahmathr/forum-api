const LikeRepository = require('../LikeRepository');

describe('LikeRepository', () => {
  it('should throw error when addLike not implemented', async () => {
    const repo = new LikeRepository();
    await expect(repo.addLike()).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteLike not implemented', async () => {
    const repo = new LikeRepository();
    await expect(repo.deleteLike()).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when isLiked not implemented', async () => {
    const repo = new LikeRepository();
    await expect(repo.isLiked()).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getLikeCountByCommentId not implemented', async () => {
    const repo = new LikeRepository();
    await expect(repo.getLikeCountByCommentId()).rejects.toThrow('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
