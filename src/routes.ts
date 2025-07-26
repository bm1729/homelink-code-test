import { FastifyInstance } from 'fastify';
import { User, UserType } from './types/user';
import '@fastify/mongodb';

async function routes(server: FastifyInstance) {
  // const collection = server.mongo.db.collection('test_collection');

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

export default routes;
