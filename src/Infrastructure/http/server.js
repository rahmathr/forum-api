const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  await server.register([Jwt]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  server.app.container = container;

  await server.register([users, authentications, threads, comments, replies]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof NotFoundError || response instanceof AuthorizationError ||
          response instanceof AuthenticationError || response instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }
      // Hapi native error (Boom)
      if (response.isServer) {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'test') console.error(response);
        return h.response({ status: 'error', message: 'terjadi kegagalan pada server kami' }).code(500);
      }
      // Boom client errors (e.g. 400 from Hapi validation)
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.output.statusCode);
    }
    return h.continue;
  });

  return server;
};

module.exports = createServer;
