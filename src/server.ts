import Fastify, { FastifyInstance } from 'fastify';
import deviceRoutes from './routes/device-routes';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import systemRoutes from './routes/system-routes';
import Ajv from 'ajv';

const ajv = new Ajv({
  strict: true,
  coerceTypes: false,
});

const buildServer = ({ mongoUri }: { mongoUri: string }): FastifyInstance => {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  server.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });

  server.register(swagger);
  server.register(swaggerUi);
  server.register(deviceRoutes, { prefix: '/api/devices', mongoUri });
  server.register(systemRoutes, { prefix: '/actuator' });

  return server;
};

export default buildServer;
