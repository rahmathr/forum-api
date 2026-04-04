const AddedReply = require('../AddedReply');

describe('AddedReply entity', () => {
  it('should create AddedReply object correctly', () => {
    const payload = { id: 'reply-123', content: 'sebuah balasan', owner: 'user-123' };
    const addedReply = new AddedReply(payload);
    expect(addedReply.id).toBe(payload.id);
    expect(addedReply.content).toBe(payload.content);
    expect(addedReply.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddedReply({ id: 'r-1', content: 'a' })).toThrowError('AddedReply: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddedReply({ id: 123, content: 'a', owner: 'user-1' })).toThrowError('AddedReply: properti harus bertipe string');
  });
});
