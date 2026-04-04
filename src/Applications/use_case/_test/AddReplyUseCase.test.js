const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('AddReplyUseCase', () => {
  it('should orchestrate add reply use case correctly', async () => {
    const useCasePayload = { content: 'sebuah balasan', commentId: 'comment-123', threadId: 'thread-123', owner: 'user-123' };
    const expectedAddedReply = new AddedReply({ id: 'reply-123', content: 'sebuah balasan', owner: 'user-123' });

    // Mock mengembalikan nilai NETRAL — bukan referensi ke expectedAddedReply
    const mockReplyRepository = { addReply: jest.fn().mockResolvedValue(new AddedReply({ id: 'reply-123', content: 'sebuah balasan', owner: 'user-123' })) };
    const mockCommentRepository = { verifyCommentExists: jest.fn().mockResolvedValue(undefined) };
    const mockThreadRepository = { verifyThreadExists: jest.fn().mockResolvedValue(undefined) };

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new AddReply(useCasePayload));
  });
});
