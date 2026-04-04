const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddedComment {
  constructor({ id, content, owner }) {
    this._verifyPayload({ id, content, owner });
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new InvariantError('AddedComment: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddedComment: properti harus bertipe string');
    }
  }
}

module.exports = AddedComment;
