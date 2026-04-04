const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate add thread use case correctly', async () => {
    const useCasePayload = { title: 'sebuah thread', body: 'sebuah body', owner: 'user-123' };
    // Expected result: nilai yang kita harapkan
    const expectedAddedThread = new AddedThread({ id: 'thread-123', title: 'sebuah thread', owner: 'user-123' });

    // Mock mengembalikan nilai NETRAL — bukan referensi ke expectedAddedThread
    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue(new AddedThread({ id: 'thread-123', title: 'sebuah thread', owner: 'user-123' })),
    };

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread(useCasePayload));
  });
});
