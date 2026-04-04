const InvariantError = require('../../../Commons/exceptions/InvariantError');

class AddReply {
  constructor({ content, commentId, threadId, owner }) {
    this._verifyPayload({ content, commentId, threadId, owner });
    this.content = content;
    this.commentId = commentId;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, commentId, threadId, owner }) {
    if (!content || !commentId || !threadId || !owner) {
      throw new InvariantError('AddReply: properti yang dibutuhkan tidak lengkap');
    }
    if (typeof content !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('AddReply: properti harus bertipe string');
    }
  }
}

module.exports = AddReply;
