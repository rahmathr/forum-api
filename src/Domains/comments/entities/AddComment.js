const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddComment {
  constructor({ content, threadId, owner }) {
    this._verifyPayload({ content, threadId, owner });
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new InvariantError('AddComment: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddComment: properti harus bertipe string');
    }
  }
}

module.exports = AddComment;
