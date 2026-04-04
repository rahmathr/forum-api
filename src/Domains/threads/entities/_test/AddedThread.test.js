const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
  it('should create AddedThread object correctly', () => {
    const payload = { id: 'thread-123', title: 'sebuah thread', owner: 'user-123' };
    const addedThread = new AddedThread(payload);
    expect(addedThread.id).toBe(payload.id);
    expect(addedThread.title).toBe(payload.title);
    expect(addedThread.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddedThread({ id: 'thread-1', title: 'a' })).toThrowError('AddedThread: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddedThread({ id: 123, title: 'a', owner: 'user-1' })).toThrowError('AddedThread: properti harus bertipe string');
  });
});
