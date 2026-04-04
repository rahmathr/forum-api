const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { content, commentId, owner } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.id, u.username, r.date, r.content, r.is_delete
             FROM replies r
             JOIN users u ON r.owner = u.id
             WHERE r.comment_id = $1
             ORDER BY r.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      content: row.content,
      date: row.date.toISOString(),
      username: row.username,
      isDelete: row.is_delete,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
