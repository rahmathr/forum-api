const AddComment = require('../AddComment');

describe('AddComment entity', () => {
  it('should create AddComment object correctly', () => {
    const payload = { content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' };
    const addComment = new AddComment(payload);
    expect(addComment.content).toBe(payload.content);
    expect(addComment.threadId).toBe(payload.threadId);
    expect(addComment.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddComment({ content: 'a', threadId: 'thread-1' })).toThrowError('AddComment: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddComment({ content: 123, threadId: 'thread-1', owner: 'user-1' })).toThrowError('AddComment: properti harus bertipe string');
  });
});
