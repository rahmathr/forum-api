const pool = require('../../../../tests/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist comment and return AddedComment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const addComment = new AddComment({ content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment.id).toBe('comment-123');
      expect(addedComment.content).toBe(addComment.content);
      expect(addedComment.owner).toBe(addComment.owner);
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment (set is_delete = true)', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await commentRepositoryPostgres.deleteComment('comment-123');

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toBe(true);
    });
  });

  describe('verifyCommentExists', () => {
    it('should not throw error when comment exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-xyz')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should not throw error when user is the comment owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow();
    });

    it('should throw AuthorizationError when user is not the comment owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-xyz')).rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError when comment does not exist in verifyCommentOwner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xyz', 'user-123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comments list correctly and mask deleted comments', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', content: 'komentar asli', threadId: 'thread-123', owner: 'user-456', date: new Date('2021-08-08T07:22:33.555Z'), isDelete: false });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', content: 'komentar dihapus', threadId: 'thread-123', owner: 'user-123', date: new Date('2021-08-08T07:26:21.338Z'), isDelete: true });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '123');

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('comment-1');
      expect(comments[0].username).toBe('johndoe');
      expect(comments[0].content).toBe('komentar asli');
      expect(comments[0].isDelete).toBe(false);
      expect(comments[1].id).toBe('comment-2');
      expect(comments[1].content).toBe('komentar dihapus');
      expect(comments[1].isDelete).toBe(true);
    });
  });
});
