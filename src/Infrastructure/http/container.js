const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('../database/postgres/pool/pool');
const UserRepositoryPostgres = require('../repositories/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('../repositories/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('../repositories/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../repositories/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../repositories/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('../repositories/LikeRepositoryPostgres');
const BcryptPasswordHash = require('../security/BcryptPasswordHash');
const JwtTokenManager = require('../security/JwtTokenManager');
const RegisterUserUseCase = require('../../Applications/use_case/RegisterUserUseCase');
const LoginUserUseCase = require('../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../Applications/use_case/GetThreadDetailUseCase');
const AddCommentUseCase = require('../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../Applications/use_case/DeleteReplyUseCase');
const ToggleLikeUseCase = require('../../Applications/use_case/ToggleLikeUseCase');

// Repositories
const userRepository = new UserRepositoryPostgres(pool, nanoid);
const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
const likeRepository = new LikeRepositoryPostgres(pool, nanoid);

// Services
const passwordHash = new BcryptPasswordHash(bcrypt);
const authenticationTokenManager = new JwtTokenManager(Jwt);

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

const container = {
  getInstance(name) {
    return instances[name];
  },
};

module.exports = container;
