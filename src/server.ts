import Fastify, { FastifyInstance } from 'fastify';
import { User, UserType } from './types/user.js';

const buildServer = (): FastifyInstance => {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  async function userRoutes(server: FastifyInstance) {
    server.post<{ Body: UserType; Reply: UserType }>(
      '/',
      {
        schema: {
          body: User,
          response: {
            200: User,
          },
        },
      },
      async (request, reply) => {
        request.log.info('Received user data:', request.body);
        const { name, mail } = request.body;
        reply.status(200).send({ name, mail });
      }
    );
  }

  server.register(userRoutes, { prefix: '/api/users' });

  return server;
};

export default buildServer;
