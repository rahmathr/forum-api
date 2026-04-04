const InvariantError = require('../../../Commons/exceptions/InvariantError');

class RegisterUser {
  constructor({ username, password, fullname }) {
    this._verifyPayload({ username, password, fullname });
    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyPayload({ username, password, fullname }) {
    if (!username || !password || !fullname) {
      throw new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    }
    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai');
    }
    if (username.length > 50) {
      throw new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    }
    if (!/^[\w]+$/.test(username)) {
      throw new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    }
  }
}

class RegisteredUser {
  constructor({ id, username, fullname }) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }
}

module.exports = { RegisterUser, RegisteredUser };
