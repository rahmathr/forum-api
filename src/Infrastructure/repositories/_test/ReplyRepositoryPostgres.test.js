const pool = require('../../../../tests/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist reply and return AddedReply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const addReply = new AddReply({ content: 'sebuah balasan', commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toBeInstanceOf(AddedReply);
      expect(addedReply.id).toBe('reply-123');
      expect(addedReply.content).toBe(addReply.content);
      expect(addedReply.owner).toBe(addReply.owner);
    });
  });

  describe('deleteReply', () => {
    it('should soft delete reply (set is_delete = true)', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await replyRepositoryPostgres.deleteReply('reply-123');

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBe(true);
    });
  });

  describe('verifyReplyExists', () => {
    it('should not throw error when reply exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await expect(replyRepositoryPostgres.verifyReplyExists('reply-xyz')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should not throw error when user is the reply owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow();
    });

    it('should throw AuthorizationError when user is not the reply owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-xyz')).rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError when reply does not exist in verifyReplyOwner', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-xyz', 'user-123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return replies list correctly and mask deleted replies', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-1', content: 'balasan dihapus', commentId: 'comment-123', owner: 'user-456', date: new Date('2021-08-08T07:59:48.766Z'), isDelete: true });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', content: 'sebuah balasan', commentId: 'comment-123', owner: 'user-123', date: new Date('2021-08-08T08:07:01.522Z'), isDelete: false });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '123');

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe('reply-1');
      expect(replies[0].content).toBe('balasan dihapus');
      expect(replies[0].isDelete).toBe(true);
      expect(replies[0].username).toBe('johndoe');
      expect(replies[1].id).toBe('reply-2');
      expect(replies[1].content).toBe('sebuah balasan');
      expect(replies[1].isDelete).toBe(false);
      expect(replies[1].username).toBe('dicoding');
    });
  });
});
