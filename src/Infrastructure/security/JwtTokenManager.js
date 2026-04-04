const Jwt = require('@hapi/jwt');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class JwtTokenManager {
  constructor(jwt) {
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.token.decode(token);
      this._jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.token.decode(token);
    const { payload } = artifacts.decoded;
    return payload;
  }
}

module.exports = JwtTokenManager;
