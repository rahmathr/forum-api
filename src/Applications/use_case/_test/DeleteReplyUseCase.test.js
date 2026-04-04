const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply use case correctly', async () => {
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123', replyId: 'reply-123', owner: 'user-123' };

    const mockReplyRepository = {
      verifyReplyExists: jest.fn().mockResolvedValue(undefined),
      verifyReplyOwner: jest.fn().mockResolvedValue(undefined),
      deleteReply: jest.fn().mockResolvedValue(undefined),
    };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCasePayload.replyId);
  });

  it('should throw AuthorizationError when user is not reply owner', async () => {
    const mockReplyRepository = {
      verifyReplyExists: jest.fn().mockResolvedValue(undefined),
      verifyReplyOwner: jest.fn().mockRejectedValue(new AuthorizationError('Anda tidak berhak menghapus balasan ini')),
      deleteReply: jest.fn(),
    };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute({ threadId: 't-1', commentId: 'c-1', replyId: 'r-1', owner: 'wrong-user' }))
      .rejects.toThrow(AuthorizationError);
    expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
  });
});
