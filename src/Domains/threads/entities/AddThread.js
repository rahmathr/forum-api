const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddThread {
  constructor({ title, body, owner }) {
    this._verifyPayload({ title, body, owner });
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new InvariantError('AddThread: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddThread: properti harus bertipe string');
    }
  }
}

module.exports = AddThread;
