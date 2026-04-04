const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddedThread {
  constructor({ id, title, owner }) {
    this._verifyPayload({ id, title, owner });
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new InvariantError('AddedThread: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddedThread: properti harus bertipe string');
    }
  }
}

module.exports = AddedThread;
