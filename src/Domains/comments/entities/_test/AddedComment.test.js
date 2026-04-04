const AddedComment = require('../AddedComment');

describe('AddedComment entity', () => {
  it('should create AddedComment object correctly', () => {
    const payload = { id: 'comment-123', content: 'sebuah komentar', owner: 'user-123' };
    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toBe(payload.id);
    expect(addedComment.content).toBe(payload.content);
    expect(addedComment.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddedComment({ id: 'c-1', content: 'a' })).toThrowError('AddedComment: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddedComment({ id: 123, content: 'a', owner: 'user-1' })).toThrowError('AddedComment: properti harus bertipe string');
  });
});
