const RegisterUserUseCase = require('../RegisterUserUseCase');
const { RegisterUser, RegisteredUser } = require('../../../Domains/users/entities/User');

describe('RegisterUserUseCase', () => {
  it('should orchestrate register user use case correctly', async () => {
    const useCasePayload = { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' };
    const expectedRegisteredUser = new RegisteredUser({ id: 'user-123', username: 'dicoding', fullname: 'Dicoding Indonesia' });

    const mockUserRepository = {
      verifyAvailableUsername: jest.fn().mockResolvedValue(undefined),
      addUser: jest.fn().mockResolvedValue(expectedRegisteredUser),
    };
    const mockPasswordHash = {
      hash: jest.fn().mockResolvedValue('hashed_secret'),
    };

    const registerUserUseCase = new RegisterUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await registerUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(expect.objectContaining({
      username: 'dicoding',
      password: 'hashed_secret',
      fullname: 'Dicoding Indonesia',
    }));
  });
});
