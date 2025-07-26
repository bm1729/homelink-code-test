import { FastifyInstance } from 'fastify';
import { DeviceType, Device } from './types/device';
import '@fastify/mongodb';

async function routes(server: FastifyInstance) {
  const collection = server.mongo.db?.collection('devices');

  server.post<{ Body: DeviceType; Reply: DeviceType }>(
    '/',
    {
      schema: {
        body: Device,
        response: {
          200: Device,
        },
      },
    },
    async (request, reply) => {
      request.log.info('Received device data:', request.body);
      collection?.insertOne(request.body);
      reply.status(200).send(request.body);
    }
  );
}

export default routes;
