require('dotenv').config();
const request = require('supertest');
const createServer = require('../server');
const pool = require('../../../../tests/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const UserRepositoryPostgres = require('../../repositories/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../../repositories/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../../repositories/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../../repositories/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../../repositories/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('../../repositories/LikeRepositoryPostgres');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');
const JwtTokenManager = require('../../security/JwtTokenManager');

const RegisterUserUseCase = require('../../../Applications/use_case/RegisterUserUseCase');
const LoginUserUseCase = require('../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../Applications/use_case/GetThreadDetailUseCase');
const AddCommentUseCase = require('../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../Applications/use_case/DeleteReplyUseCase');
const ToggleLikeUseCase = require('../../../Applications/use_case/ToggleLikeUseCase');

const buildTestContainer = () => {
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
  const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
  const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
  const likeRepository = new LikeRepositoryPostgres(pool, nanoid);
  const passwordHash = new BcryptPasswordHash(bcrypt);
  const authenticationTokenManager = new JwtTokenManager();

  const instances = {
    [RegisterUserUseCase.name]: new RegisterUserUseCase({ userRepository, passwordHash }),
    [LoginUserUseCase.name]: new LoginUserUseCase({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash }),
    [LogoutUserUseCase.name]: new LogoutUserUseCase({ authenticationRepository }),
    [RefreshAuthenticationUseCase.name]: new RefreshAuthenticationUseCase({ authenticationRepository, authenticationTokenManager }),
    [AddThreadUseCase.name]: new AddThreadUseCase({ threadRepository }),
    [GetThreadDetailUseCase.name]: new GetThreadDetailUseCase({ threadRepository, commentRepository, replyRepository, likeRepository }),
    [AddCommentUseCase.name]: new AddCommentUseCase({ commentRepository, threadRepository }),
    [DeleteCommentUseCase.name]: new DeleteCommentUseCase({ commentRepository, threadRepository }),
    [AddReplyUseCase.name]: new AddReplyUseCase({ replyRepository, commentRepository, threadRepository }),
    [DeleteReplyUseCase.name]: new DeleteReplyUseCase({ replyRepository, commentRepository, threadRepository }),
    [ToggleLikeUseCase.name]: new ToggleLikeUseCase({ likeRepository, commentRepository, threadRepository }),
  };
  return { getInstance: (name) => instances[name] };
};

describe('HTTP Server', () => {
  let app;
  let accessToken;
  let refreshToken;
  let threadId;
  let commentId;
  let replyId;

  beforeAll(async () => {
    const container = buildTestContainer();
    app = createServer(container);

    await request(app).post('/users')
      .send({ username: 'testuser', password: 'password123', fullname: 'Test User' });

    const loginRes = await request(app).post('/authentications')
      .send({ username: 'testuser', password: 'password123' });
    accessToken = loginRes.body.data.accessToken;
    refreshToken = loginRes.body.data.refreshToken;
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.query('DELETE FROM authentications WHERE 1=1');
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('Server error handling', () => {
    it('should return 404 for unknown route', async () => {
      const res = await request(app).get('/nonexistent-route');
      expect(res.statusCode).toBe(404);
    });

    it('should set auth to null when token is invalid', async () => {
      const res = await request(app).post('/threads')
        .set('Authorization', 'Bearer invalid_token')
        .send({ title: 'a', body: 'b' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /users', () => {
    it('should return 201 and addedUser', async () => {
      const res = await request(app).post('/users')
        .send({ username: 'newuser', password: 'password123', fullname: 'New User' });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.addedUser).toBeDefined();
    });

    it('should return 400 when payload is missing', async () => {
      const res = await request(app).post('/users')
        .send({ username: 'only' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /authentications (login)', () => {
    it('should return 201 and tokens', async () => {
      const res = await request(app).post('/authentications')
        .send({ username: 'testuser', password: 'password123' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 when credentials are wrong', async () => {
      const res = await request(app).post('/authentications')
        .send({ username: 'testuser', password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /authentications (refresh token)', () => {
    it('should return 200 and new accessToken', async () => {
      const res = await request(app).put('/authentications')
        .send({ refreshToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 400 when refresh token is invalid', async () => {
      const res = await request(app).put('/authentications')
        .send({ refreshToken: 'invalid_refresh_token' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /authentications (logout)', () => {
    it('should return 200 on successful logout', async () => {
      const loginRes = await request(app).post('/authentications')
        .send({ username: 'testuser', password: 'password123' });
      const tokenToLogout = loginRes.body.data.refreshToken;
      const res = await request(app).delete('/authentications')
        .send({ refreshToken: tokenToLogout });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should return 400 when refresh token not found', async () => {
      const res = await request(app).delete('/authentications')
        .send({ refreshToken: 'nonexistent_token' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /threads', () => {
    it('should return 201 and addedThread', async () => {
      const res = await request(app).post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.addedThread.id).toBeDefined();
      threadId = res.body.data.addedThread.id;
    });

    it('should return 400 when body is missing', async () => {
      const res = await request(app).post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'hanya judul' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no access token', async () => {
      const res = await request(app).post('/threads')
        .send({ title: 'a', body: 'b' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /threads/:threadId/comments', () => {
    it('should return 201 and addedComment', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.addedComment.id).toBeDefined();
      commentId = res.body.data.addedComment.id;
    });

    it('should return 401 when no authentication', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments`)
        .send({ content: 'komentar' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 when thread does not exist', async () => {
      const res = await request(app).post('/threads/thread-xyz/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'komentar' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 when content is missing', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should return 201 and addedReply', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.addedReply.id).toBeDefined();
      replyId = res.body.data.addedReply.id;
    });

    it('should return 401 when no authentication', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`)
        .send({ content: 'balasan' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 when comment does not exist', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments/comment-xyz/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'balasan' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 when content is missing', async () => {
      const res = await request(app).post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /threads/:threadId', () => {
    it('should return 200 and thread detail with comments and replies', async () => {
      const res = await request(app).get(`/threads/${threadId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.thread.id).toBe(threadId);
      expect(res.body.data.thread.comments).toHaveLength(1);
      expect(res.body.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('should return 404 when thread does not exist', async () => {
      const res = await request(app).get('/threads/thread-xyz');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /threads/:threadId/comments/:commentId/likes', () => {
    it('should return 200 when liking a comment', async () => {
      const res = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should return 401 when no authentication', async () => {
      const res = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should return 403 when user is not the reply owner', async () => {
      await request(app).post('/users')
        .send({ username: 'otheruser', password: 'password123', fullname: 'Other User' });
      const loginRes = await request(app).post('/authentications')
        .send({ username: 'otheruser', password: 'password123' });
      const otherToken = loginRes.body.data.accessToken;
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return 401 when no authentication', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 when reply does not exist', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/reply-xyz`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 when reply owner deletes reply', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId', () => {
    it('should return 403 when user is not the comment owner', async () => {
      const loginRes = await request(app).post('/authentications')
        .send({ username: 'otheruser', password: 'password123' });
      const otherToken = loginRes.body.data.accessToken;
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return 401 when no authentication', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`);
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 when comment does not exist', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/comment-xyz`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 when comment owner deletes comment', async () => {
      const res = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });
});
