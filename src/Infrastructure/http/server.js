const express = require('express');
const jwt = require('jsonwebtoken');

const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');
const likes = require('../../Interfaces/http/api/likes');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

const createServer = (container) => {
  const app = express();
  app.use(express.json());

  // Auth middleware
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.auth = { credentials: { id: decoded.id } };
      } catch {
        req.auth = null;
      }
    } else {
      req.auth = null;
    }
    next();
  });

  app.use((req, res, next) => {
    req.container = container;
    next();
  });

  // Routes
  app.use(users);
  app.use(authentications);
  app.use(threads);
  app.use(comments);
  app.use(replies);
  app.use(likes);

  // Error handler
  /* istanbul ignore next */
  app.use((err, req, res, next) => {
    if (err instanceof NotFoundError || err instanceof AuthorizationError ||
        err instanceof AuthenticationError || err instanceof InvariantError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

module.exports = createServer;