import Fastify, { FastifyInstance } from 'fastify';
import fastifyMongo from '@fastify/mongodb';
import routes from './routes';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const buildServer = (config: { mongoUri: string }): FastifyInstance => {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  server.register(swagger);
  server.register(swaggerUi);
  server.register(fastifyMongo, { url: config.mongoUri });
  server.register(routes, { prefix: '/api/devices' });

  return server;
};

export default buildServer;
