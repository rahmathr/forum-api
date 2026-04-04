const AddThread = require('../AddThread');

describe('AddThread entity', () => {
  it('should create AddThread object correctly', () => {
    const payload = { title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' };
    const addThread = new AddThread(payload);
    expect(addThread.title).toBe(payload.title);
    expect(addThread.body).toBe(payload.body);
    expect(addThread.owner).toBe(payload.owner);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new AddThread({ title: 'a', body: 'b' })).toThrowError('AddThread: properti yang dibutuhkan tidak lengkap');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new AddThread({ title: 123, body: 'b', owner: 'user-1' })).toThrowError('AddThread: properti harus bertipe string');
  });
});
