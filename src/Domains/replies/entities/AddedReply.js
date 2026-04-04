const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddedReply {
  constructor({ id, content, owner }) {
    this._verifyPayload({ id, content, owner });
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new InvariantError('AddedReply: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddedReply: properti harus bertipe string');
    }
  }
}

module.exports = AddedReply;
