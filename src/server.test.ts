import { FastifyInstance } from 'fastify';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import buildServer from './server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

describe('server', () => {
  let server: FastifyInstance;
  let mongoServer: MongoMemoryServer;
  let client: MongoClient;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: { dbName: 'homelink' },
    });
    const uri = mongoServer.getUri() + 'homelink';
    client = new MongoClient(uri);
    await client.connect();

    // Pass the client or URI to your Fastify plugin
    server = buildServer({ mongoUri: uri });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  test('should respond to POST /api/users with user data', async () => {
    const deviceData = { name: 'John Doe', mail: 'jane@gmail.com' };
    const response = await server.inject({
      method: 'POST',
      url: '/api/devices/',
      payload: deviceData,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(deviceData);
    expect(
      client.db().collection('devices').findOne({ name: 'John Doe' })
    ).resolves.toMatchObject(deviceData);
  });
});
