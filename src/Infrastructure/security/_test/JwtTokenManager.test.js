const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  const jwtTokenManager = new JwtTokenManager();

  describe('createAccessToken', () => {
    it('should create accessToken correctly', async () => {
      process.env.ACCESS_TOKEN_KEY = 'access_token_key_for_test_minimum_32_chars!!';
      const payload = { id: 'user-123', username: 'dicoding' };
      const accessToken = await jwtTokenManager.createAccessToken(payload);
      expect(typeof accessToken).toBe('string');
    });
  });

  describe('createRefreshToken', () => {
    it('should create refreshToken correctly', async () => {
      process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_for_test_minimum_32_chars!!';
      const payload = { id: 'user-123', username: 'dicoding' };
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);
      expect(typeof refreshToken).toBe('string');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return decoded payload when token is valid', async () => {
      process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_for_test_minimum_32_chars!!';
      const payload = { id: 'user-123', username: 'dicoding' };
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);
      const decoded = await jwtTokenManager.verifyRefreshToken(refreshToken);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.username).toBe(payload.username);
    });

    it('should throw InvariantError when token is invalid', async () => {
      await expect(jwtTokenManager.verifyRefreshToken('invalid_token')).rejects.toThrow(InvariantError);
    });
  });

  describe('decodePayload', () => {
    it('should decode access token payload correctly', async () => {
      process.env.ACCESS_TOKEN_KEY = 'access_token_key_for_test_minimum_32_chars!!';
      const payload = { id: 'user-123', username: 'dicoding' };
      const accessToken = await jwtTokenManager.createAccessToken(payload);
      const decoded = await jwtTokenManager.decodePayload(accessToken);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.username).toBe(payload.username);
    });
  });
});