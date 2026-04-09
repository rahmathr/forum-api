class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        const likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id);
        const mappedReplies = replies.map(({ isDelete, ...reply }) => ({
          ...reply,
          content: isDelete ? '**balasan telah dihapus**' : reply.content,
        }));
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          replies: mappedReplies,
          content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
          likeCount,
        };
      })
    );
    return { ...thread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadDetailUseCase;
