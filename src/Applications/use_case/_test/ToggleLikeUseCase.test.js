const ToggleLikeUseCase = require('../ToggleLikeUseCase');

describe('ToggleLikeUseCase', () => {
  it('should like comment when not yet liked', async () => {
    const mockLikeRepository = {
      isLiked: jest.fn().mockResolvedValue(false),
      addLike: jest.fn().mockResolvedValue(),
      deleteLike: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(),
    };
    const mockThreadRepository = {
      verifyThreadExists: jest.fn().mockResolvedValue(),
    };

    const useCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute('thread-123', 'comment-123', 'user-123');

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.isLiked).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should unlike comment when already liked', async () => {
    const mockLikeRepository = {
      isLiked: jest.fn().mockResolvedValue(true),
      addLike: jest.fn().mockResolvedValue(),
      deleteLike: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = {
      verifyCommentExists: jest.fn().mockResolvedValue(),
    };
    const mockThreadRepository = {
      verifyThreadExists: jest.fn().mockResolvedValue(),
    };

    const useCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await useCase.execute('thread-123', 'comment-123', 'user-123');

    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.addLike).not.toHaveBeenCalled();
  });
});
