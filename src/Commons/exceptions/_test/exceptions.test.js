const NotFoundError = require('../NotFoundError');
const AuthorizationError = require('../AuthorizationError');
const AuthenticationError = require('../AuthenticationError');
const InvariantError = require('../InvariantError');

describe('Custom Exceptions', () => {
  describe('NotFoundError', () => {
    it('should create error with correct name and statusCode', () => {
      const error = new NotFoundError('not found');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('not found');
    });
  });

  describe('AuthorizationError', () => {
    it('should create error with correct name and statusCode', () => {
      const error = new AuthorizationError('forbidden');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AuthorizationError');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('forbidden');
    });
  });

  describe('AuthenticationError', () => {
    it('should create error with correct name and statusCode', () => {
      const error = new AuthenticationError('unauthorized');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AuthenticationError');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('unauthorized');
    });
  });

  describe('InvariantError', () => {
    it('should create error with correct name and statusCode', () => {
      const error = new InvariantError('bad request');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('InvariantError');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('bad request');
    });
  });
});
