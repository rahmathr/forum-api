const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash', () => {
    it('should hash password correctly', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const hashed = await bcryptPasswordHash.hash('plain_password');
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe('plain_password');
    });
  });

  describe('comparePassword', () => {
    it('should not throw when password matches hash', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const hashed = await bcrypt.hash('secret', 10);
      await expect(bcryptPasswordHash.comparePassword('secret', hashed)).resolves.not.toThrow();
    });

    it('should throw AuthenticationError when password does not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const hashed = await bcrypt.hash('secret', 10);
      await expect(bcryptPasswordHash.comparePassword('wrong', hashed)).rejects.toThrow(AuthenticationError);
    });
  });
});
