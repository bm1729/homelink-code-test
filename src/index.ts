import Fastify from 'fastify';
import { User, UserType } from './types/user.js';

const fastify = Fastify({
  logger: true,
});

fastify.post<{ Body: UserType; Reply: UserType }>(
  '/users',
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

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
