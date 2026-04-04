const AddReply = require('../AddReply');

describe('AddReply entity', () => {
  it('should create AddReply object correctly', () => {
    const payload = { content: 'sebuah balasan', commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' };
    const addReply = new AddReply(payload);
    expect(addReply.content).toBe(payload.content);
    expect(addReply.commentId).toBe(payload.commentId);
    expect(addReply.threadId).toBe(payload.threadId);
    expect(addReply.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddReply({ content: 'a', commentId: 'c-1' })).toThrowError('AddReply: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddReply({ content: 123, commentId: 'c-1', threadId: 't-1', owner: 'u-1' })).toThrowError('AddReply: properti harus bertipe string');
  });
});
