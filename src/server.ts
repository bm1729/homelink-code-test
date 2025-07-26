import Fastify, { FastifyInstance } from 'fastify';
import fastifyMongo from '@fastify/mongodb';
import routes from './routes';

const buildServer = (config: { mongoUri: string }): FastifyInstance => {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  server.register(fastifyMongo, { url: config.mongoUri });
  server.register(routes, { prefix: '/api/users' });

  return server;
};

export default buildServer;
