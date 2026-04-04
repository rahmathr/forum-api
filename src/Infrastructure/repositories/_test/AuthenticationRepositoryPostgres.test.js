require('dotenv').config();
const pool = require('../../../../tests/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken', () => {
    it('should persist token to database', async () => {
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await authenticationRepository.addToken('refresh_token');
      const result = await pool.query("SELECT token FROM authentications WHERE token = 'refresh_token'");
      expect(result.rows).toHaveLength(1);
    });
  });

  describe('checkAvailabilityToken', () => {
    it('should not throw when token exists', async () => {
      await pool.query("INSERT INTO authentications VALUES('refresh_token')");
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await expect(authenticationRepository.checkAvailabilityToken('refresh_token')).resolves.not.toThrow();
    });

    it('should throw InvariantError when token does not exist', async () => {
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await expect(authenticationRepository.checkAvailabilityToken('nonexistent')).rejects.toThrow(InvariantError);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should not throw when token exists', async () => {
      await pool.query("INSERT INTO authentications VALUES('refresh_token')");
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await expect(authenticationRepository.verifyRefreshToken('refresh_token')).resolves.not.toThrow();
    });

    it('should throw InvariantError with correct message when token does not exist', async () => {
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await expect(authenticationRepository.verifyRefreshToken('nonexistent')).rejects.toThrow('refresh token tidak valid');
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      await pool.query("INSERT INTO authentications VALUES('refresh_token')");
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      await authenticationRepository.deleteToken('refresh_token');
      const result = await pool.query("SELECT token FROM authentications WHERE token = 'refresh_token'");
      expect(result.rows).toHaveLength(0);
    });
  });
});
