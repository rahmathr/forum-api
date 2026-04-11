const jwt = require('jsonwebtoken');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager {
  constructor() {}

  async createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: Number(process.env.ACCESS_TOKEN_AGE) || 1800,
  });
}

  async createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const payload = jwt.decode(token);
    return payload;
  }
}

module.exports = JwtTokenManager;