const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate delete comment use case correctly', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123' };

    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(undefined),
      verifyCommentOwner: jest.fn().mockResolvedValue(undefined),
      deleteComment: jest.fn().mockResolvedValue(undefined),
    };
    const mockThreadRepository = {
      verifyThreadExists: jest.fn().mockResolvedValue(undefined),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw AuthorizationError when user is not comment owner', async () => {
    const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(undefined),
      verifyCommentOwner: jest.fn().mockRejectedValue(new AuthorizationError('Anda tidak berhak menghapus komentar ini')),
      deleteComment: jest.fn(),
    };
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute({ threadId: 't-1', commentId: 'c-1', owner: 'wrong-user' }))
      .rejects.toThrow(AuthorizationError);
    expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
  });
});
