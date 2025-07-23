import { FastifyInstance } from 'fastify';

async function routes(server: FastifyInstance) {
  server.get('/health', async (_request, reply) => {
    reply.status(200).send({ status: 'ok' });
  });
}

export default routes;
