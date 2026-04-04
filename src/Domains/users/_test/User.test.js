const { RegisterUser, RegisteredUser } = require('../entities/User');

describe('RegisterUser entity', () => {
  it('should create RegisterUser correctly', () => {
    const payload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
    const user = new RegisterUser(payload);
    expect(user.username).toBe(payload.username);
    expect(user.password).toBe(payload.password);
    expect(user.fullname).toBe(payload.fullname);
  });

  it('should throw InvariantError when payload is missing properties', () => {
    expect(() => new RegisterUser({ username: 'a', password: 'b' }))
      .toThrowError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
  });

  it('should throw InvariantError when payload has wrong type', () => {
    expect(() => new RegisterUser({ username: 123, password: 'b', fullname: 'c' }))
      .toThrowError('tidak dapat membuat user baru karena tipe data tidak sesuai');
  });

  it('should throw InvariantError when username exceeds 50 characters', () => {
    expect(() => new RegisterUser({ username: 'a'.repeat(51), password: 'b', fullname: 'c' }))
      .toThrowError('tidak dapat membuat user baru karena karakter username melebihi batas limit');
  });

  it('should throw InvariantError when username contains forbidden characters', () => {
    expect(() => new RegisterUser({ username: 'user name!', password: 'b', fullname: 'c' }))
      .toThrowError('tidak dapat membuat user baru karena username mengandung karakter terlarang');
  });
});

describe('RegisteredUser entity', () => {
  it('should create RegisteredUser correctly', () => {
    const payload = { id: 'user-123', username: 'dicoding', fullname: 'Dicoding Indonesia' };
    const user = new RegisteredUser(payload);
    expect(user.id).toBe(payload.id);
    expect(user.username).toBe(payload.username);
    expect(user.fullname).toBe(payload.fullname);
  });
});
