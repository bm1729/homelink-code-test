import { FastifyInstance } from 'fastify';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import buildServer from './server.js';

describe('server', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  test('should respond to POST /api/users with user data', async () => {
    const userData = { name: 'John Doe', mail: 'jane@gmail.com' };
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/',
      payload: userData,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(userData);
  });
});
