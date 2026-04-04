const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate add comment use case correctly', async () => {
    const useCasePayload = { content: 'sebuah komentar', threadId: 'thread-123', owner: 'user-123' };
    const expectedAddedComment = new AddedComment({ id: 'comment-123', content: 'sebuah komentar', owner: 'user-123' });

    // Mock mengembalikan nilai NETRAL — bukan referensi ke expectedAddedComment
    const mockCommentRepository = {
      addComment: jest.fn().mockResolvedValue(new AddedComment({ id: 'comment-123', content: 'sebuah komentar', owner: 'user-123' })),
    };
    const mockThreadRepository = {
      verifyThreadExists: jest.fn().mockResolvedValue(undefined),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new AddComment(useCasePayload));
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    const mockCommentRepository = { addComment: jest.fn() };
    const mockThreadRepository = {
      verifyThreadExists: jest.fn().mockRejectedValue(new Error('Thread tidak ditemukan')),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addCommentUseCase.execute({ content: 'a', threadId: 'thread-xyz', owner: 'user-1' }))
      .rejects.toThrow('Thread tidak ditemukan');
    expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
  });
});
