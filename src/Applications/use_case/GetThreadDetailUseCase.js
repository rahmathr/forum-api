class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        // Business logic: mask deleted replies
        const mappedReplies = replies.map(({ isDelete, ...reply }) => ({
          ...reply,
          content: isDelete ? '**balasan telah dihapus**' : reply.content,
        }));

        // Business logic: mask deleted comments, remove isDelete flag
        // Field order matches Dicoding spec: id, username, date, replies, content
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          replies: mappedReplies,
          content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
        };
      })
    );

    return { ...thread, comments: commentsWithReplies };
  }
}

module.exports = GetThreadDetailUseCase;
