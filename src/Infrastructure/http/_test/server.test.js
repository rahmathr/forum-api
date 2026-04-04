require('dotenv').config();
const createServer = require('../server');
const pool = require('../../../../tests/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

const UserRepositoryPostgres = require('../../repositories/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../../repositories/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../../repositories/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../../repositories/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../../repositories/ReplyRepositoryPostgres');
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

const buildTestContainer = () => {
  const userRepository = new UserRepositoryPostgres(pool, nanoid);
  const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
  const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
  const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
  const passwordHash = new BcryptPasswordHash(bcrypt);
  const authenticationTokenManager = new JwtTokenManager(Jwt);

  const instances = {
    [RegisterUserUseCase.name]: new RegisterUserUseCase({ userRepository, passwordHash }),
    [LoginUserUseCase.name]: new LoginUserUseCase({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash }),
    [LogoutUserUseCase.name]: new LogoutUserUseCase({ authenticationRepository }),
    [RefreshAuthenticationUseCase.name]: new RefreshAuthenticationUseCase({ authenticationRepository, authenticationTokenManager }),
    [AddThreadUseCase.name]: new AddThreadUseCase({ threadRepository }),
    [GetThreadDetailUseCase.name]: new GetThreadDetailUseCase({ threadRepository, commentRepository, replyRepository }),
    [AddCommentUseCase.name]: new AddCommentUseCase({ commentRepository, threadRepository }),
    [DeleteCommentUseCase.name]: new DeleteCommentUseCase({ commentRepository, threadRepository }),
    [AddReplyUseCase.name]: new AddReplyUseCase({ replyRepository, commentRepository, threadRepository }),
    [DeleteReplyUseCase.name]: new DeleteReplyUseCase({ replyRepository, commentRepository, threadRepository }),
  };
  return { getInstance: (name) => instances[name] };
};

describe('HTTP Server', () => {
  let server;
  let accessToken;
  let refreshToken;
  let threadId;
  let commentId;
  let replyId;

  beforeAll(async () => {
    const container = buildTestContainer();
    server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username: 'testuser', password: 'password123', fullname: 'Test User' },
    });

    const loginRes = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username: 'testuser', password: 'password123' },
    });
    const loginData = JSON.parse(loginRes.payload);
    accessToken = loginData.data.accessToken;
    refreshToken = loginData.data.refreshToken;
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.query('DELETE FROM authentications WHERE 1=1');
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  // --- SERVER ERROR HANDLING ---
  describe('Server error handling', () => {
    it('should return 404 for unknown route (Boom client error)', async () => {
      const res = await server.inject({ method: 'GET', url: '/nonexistent-route' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 500 for internal server error', async () => {
      // Register a route that throws a plain Error (not Boom, not custom) to trigger isServer branch
      server.route({
        method: 'GET',
        path: '/test-500',
        handler: () => {
          const err = new Error('internal error');
          err.isServer = true;
          err.isBoom = true;
          err.output = { statusCode: 500 };
          throw err;
        },
      });
      const res = await server.inject({ method: 'GET', url: '/test-500' });
      expect(res.statusCode).toBe(500);
      const data = JSON.parse(res.payload);
      expect(data.status).toBe('error');
      expect(data.message).toBe('terjadi kegagalan pada server kami');
    });
  });

  // --- USERS ---
  describe('POST /users', () => {
    it('should return 201 and addedUser', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'newuser', password: 'password123', fullname: 'New User' },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(data.status).toBe('success');
      expect(data.data.addedUser).toBeDefined();
    });

    it('should return 400 when payload is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'only' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  // --- AUTHENTICATIONS ---
  describe('POST /authentications (login)', () => {
    it('should return 201 and tokens', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'testuser', password: 'password123' },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(data.data.accessToken).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();
    });

    it('should return 400 when credentials are wrong', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'testuser', password: 'wrongpassword' },
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /authentications (refresh token)', () => {
    it('should return 200 and new accessToken', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.accessToken).toBeDefined();
    });

    it('should return 400 when refresh token is invalid', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken: 'invalid_refresh_token' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /authentications (logout)', () => {
    it('should return 200 on successful logout', async () => {
      // Login fresh to get a token to logout
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'testuser', password: 'password123' },
      });
      const tokenToLogout = JSON.parse(loginRes.payload).data.refreshToken;

      const res = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: tokenToLogout },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe('success');
    });

    it('should return 400 when refresh token not found', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken: 'nonexistent_token' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  // --- THREADS ---
  describe('POST /threads', () => {
    it('should return 201 and addedThread', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { title: 'sebuah thread', body: 'sebuah body thread' },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(data.status).toBe('success');
      expect(data.data.addedThread.id).toBeDefined();
      expect(data.data.addedThread.title).toBe('sebuah thread');
      threadId = data.data.addedThread.id;
    });

    it('should return 400 when body is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { title: 'hanya judul' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 when no access token', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a', body: 'b' },
      });
      expect(res.statusCode).toBe(401);
    });
  });

  // --- COMMENTS ---
  describe('POST /threads/{threadId}/comments', () => {
    it('should return 201 and addedComment', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: 'sebuah komentar' },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(data.status).toBe('success');
      expect(data.data.addedComment.id).toBeDefined();
      commentId = data.data.addedComment.id;
    });

    it('should return 404 when thread does not exist', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/threads/thread-xyz/comments',
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: 'komentar' },
      });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 when content is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: {},
      });
      expect(res.statusCode).toBe(400);
    });
  });

  // --- REPLIES ---
  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should return 201 and addedReply', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: 'sebuah balasan' },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(data.status).toBe('success');
      expect(data.data.addedReply.id).toBeDefined();
      replyId = data.data.addedReply.id;
    });

    it('should return 404 when comment does not exist', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-xyz/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: { content: 'balasan' },
      });
      expect(res.statusCode).toBe(404);
    });

    it('should return 400 when content is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
        payload: {},
      });
      expect(res.statusCode).toBe(400);
    });
  });

  // --- GET THREAD DETAIL ---
  describe('GET /threads/{threadId}', () => {
    it('should return 200 and thread detail with comments and replies', async () => {
      const res = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.thread.id).toBe(threadId);
      expect(data.data.thread.comments).toHaveLength(1);
      expect(data.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('should return 404 when thread does not exist', async () => {
      const res = await server.inject({ method: 'GET', url: '/threads/thread-xyz' });
      expect(res.statusCode).toBe(404);
    });
  });

  // --- DELETE REPLY ---
  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should return 403 when user is not the reply owner', async () => {
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { username: 'otheruser', password: 'password123', fullname: 'Other User' },
      });
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'otheruser', password: 'password123' },
      });
      const otherToken = JSON.parse(loginRes.payload).data.accessToken;

      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${otherToken}` },
      });
      expect(res.statusCode).toBe(403);
    });

    it('should return 404 when reply does not exist', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-xyz`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 when reply owner deletes reply', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe('success');
    });
  });

  // --- DELETE COMMENT ---
  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should return 403 when user is not the comment owner', async () => {
      const loginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'otheruser', password: 'password123' },
      });
      const otherToken = JSON.parse(loginRes.payload).data.accessToken;

      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${otherToken}` },
      });
      expect(res.statusCode).toBe(403);
    });

    it('should return 404 when comment does not exist', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-xyz`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 when comment owner deletes comment', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe('success');
    });
  });
});
