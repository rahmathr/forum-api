const pool = require('../../../../tests/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist thread and return AddedThread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const addThread = new AddThread({ title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toBeInstanceOf(AddedThread);
      expect(addedThread.id).toBe('thread-123');
      expect(addedThread.title).toBe(addThread.title);
      expect(addedThread.owner).toBe(addThread.owner);
    });
  });

  describe('verifyThreadExists', () => {
    it('should not throw error when thread exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-xyz')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getThreadById', () => {
    it('should return thread detail correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('sebuah thread');
      expect(thread.body).toBe('sebuah body');
      expect(thread.username).toBe('dicoding');
      expect(thread.date).toBeDefined();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      await expect(threadRepositoryPostgres.getThreadById('thread-xyz')).rejects.toThrow(NotFoundError);
    });
  });
});
