const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const pool = require('../../../../tests/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await pool.query('DELETE FROM likes');
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'testuser' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  const likeRepository = new LikeRepositoryPostgres(pool, () => '123');

  describe('addLike', () => {
    it('should add like correctly', async () => {
      await likeRepository.addLike('comment-123', 'user-123');
      const result = await pool.query('SELECT * FROM likes WHERE comment_id = $1 AND owner = $2', ['comment-123', 'user-123']);
      expect(result.rowCount).toBe(1);
    });
  });

  describe('deleteLike', () => {
    it('should delete like correctly', async () => {
      await likeRepository.addLike('comment-123', 'user-123');
      await likeRepository.deleteLike('comment-123', 'user-123');
      const result = await pool.query('SELECT * FROM likes WHERE comment_id = $1 AND owner = $2', ['comment-123', 'user-123']);
      expect(result.rowCount).toBe(0);
    });
  });

  describe('isLiked', () => {
    it('should return true when liked', async () => {
      await likeRepository.addLike('comment-123', 'user-123');
      const result = await likeRepository.isLiked('comment-123', 'user-123');
      expect(result).toBe(true);
    });

    it('should return false when not liked', async () => {
      const result = await likeRepository.isLiked('comment-123', 'user-123');
      expect(result).toBe(false);
    });
  });

  describe('getLikeCountByCommentId', () => {
    it('should return like count correctly', async () => {
      await likeRepository.addLike('comment-123', 'user-123');
      const count = await likeRepository.getLikeCountByCommentId('comment-123');
      expect(count).toBe(1);
    });

    it('should return 0 when no likes', async () => {
      const count = await likeRepository.getLikeCountByCommentId('comment-123');
      expect(count).toBe(0);
    });
  });
});