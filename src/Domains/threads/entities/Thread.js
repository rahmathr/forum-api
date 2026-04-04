const InvariantError = require('../../../Commons/exceptions/InvariantError');

class Thread {
  constructor({ id, title, body, owner }) {
    this._verifyPayload({ id, title, body, owner });
    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ id, title, body, owner }) {
    if (!id || !title || !body || !owner) {
      throw new InvariantError('Thread: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('Thread: properti harus bertipe string');
    }
  }
}

module.exports = Thread;
