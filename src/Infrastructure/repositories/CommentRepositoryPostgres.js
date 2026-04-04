const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, threadId, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus komentar ini');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content, c.is_delete
             FROM comments c
             JOIN users u ON c.owner = u.id
             WHERE c.thread_id = $1
             ORDER BY c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      date: row.date.toISOString(),
      content: row.content,
      isDelete: row.is_delete,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
