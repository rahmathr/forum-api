const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash {
  constructor(bcrypt, saltRound = 10) {
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);
    if (!result) {
      throw new AuthenticationError('Kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordHash;
