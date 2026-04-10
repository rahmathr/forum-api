const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate get thread detail correctly including masking deleted content', async () => {
    const threadId = 'thread-123';

    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      { id: 'comment-1', username: 'johndoe', date: '2021-08-08T07:22:33.555Z', content: 'sebuah comment', isDelete: false },
      { id: 'comment-2', username: 'dicoding', date: '2021-08-08T07:26:21.338Z', content: 'komentar ini dihapus', isDelete: true },
    ];

    const mockRepliesComment1 = [
      { id: 'reply-1', content: 'balasan dihapus', date: '2021-08-08T07:59:48.766Z', username: 'johndoe', isDelete: true },
      { id: 'reply-2', content: 'sebuah balasan', date: '2021-08-08T08:07:01.522Z', username: 'dicoding', isDelete: false },
    ];
    const mockRepliesComment2 = [];

    const mockThreadRepository = {
      getThreadById: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: jest.fn()
        .mockResolvedValueOnce(mockRepliesComment1)
        .mockResolvedValueOnce(mockRepliesComment2),
    };
    const mockLikeRepository = {
      getLikeCountByCommentId: jest.fn().mockResolvedValue(0),
    };

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const result = await getThreadDetailUseCase.execute(threadId);

    expect(result).toEqual({
      ...mockThread,
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          replies: [
            { id: 'reply-1', content: '**balasan telah dihapus**', date: '2021-08-08T07:59:48.766Z', username: 'johndoe' },
            { id: 'reply-2', content: 'sebuah balasan', date: '2021-08-08T08:07:01.522Z', username: 'dicoding' },
          ],
          content: 'sebuah comment',
          likeCount: 0,
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          replies: [],
          content: '**komentar telah dihapus**',
          likeCount: 0,
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-1');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-2');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-1');
    expect(mockLikeRepository.getLikeCountByCommentId).toHaveBeenCalledWith('comment-2');
  });
});
