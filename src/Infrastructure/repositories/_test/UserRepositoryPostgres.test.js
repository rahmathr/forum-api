const pool = require('../../../../tests/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const { RegisterUser, RegisteredUser } = require('../../../Domains/users/entities/User');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser', () => {
    it('should persist user and return RegisteredUser correctly', async () => {
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const registerUser = new RegisterUser({ username: 'dicoding', password: 'hashed_password', fullname: 'Dicoding Indonesia' });

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(registeredUser).toBeInstanceOf(RegisteredUser);
      expect(registeredUser.id).toBe('user-123');
      expect(registeredUser.username).toBe('dicoding');
      expect(registeredUser.fullname).toBe('Dicoding Indonesia');
    });
  });

  describe('verifyAvailableUsername', () => {
    it('should not throw error when username is available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrow();
    });

    it('should throw InvariantError when username is taken', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername', () => {
    it('should return hashed password correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding', password: 'hashed_password' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
      expect(password).toBe('hashed_password');
    });

    it('should throw NotFoundError when username is not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      await expect(userRepositoryPostgres.getPasswordByUsername('nonexistent')).rejects.toThrow(InvariantError);
    });
  });

  describe('getIdByUsername', () => {
    it('should return user id correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      const id = await userRepositoryPostgres.getIdByUsername('dicoding');
      expect(id).toBe('user-123');
    });

    it('should throw NotFoundError when username is not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123');
      await expect(userRepositoryPostgres.getIdByUsername('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });
});
