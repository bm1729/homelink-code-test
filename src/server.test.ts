import { FastifyInstance } from 'fastify';
import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
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

    server = buildServer({ mongoUri: uri });
    await server.ready();
  });

  afterAll(async () => {
    if (server) {
      await server.close();
    }
  });

  beforeEach(async () => {
    await client.db().collection('devices').deleteMany({});
  });

  describe('POST /api/devices', () => {
    test('when request is valid, should respond with device data and add data to db', async () => {
      // arrange
      const deviceData = {
        name: 'Fire alarm',
        status: 'active',
        description: 'Kitchen over hob',
      };

      // act
      const response = await server.inject({
        method: 'POST',
        url: '/api/devices/',
        payload: deviceData,
      });

      // assert
      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject(deviceData);
      expect(
        client.db().collection('devices').findOne({ name: 'Fire alarm' })
      ).resolves.toMatchObject(deviceData);
    });

    test('when request.name is wrong type, should respond with 400', async () => {
      // act
      const response = await server.inject({
        method: 'POST',
        url: '/api/devices/',
        payload: { name: 15 },
      });

      // assert
      expect(response.statusCode).toBe(400);
    });

    test('when request.name missing, should respond with 400', async () => {
      // act
      const response = await server.inject({
        method: 'POST',
        url: '/api/devices/',
        payload: {},
      });

      // assert
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/devices/:_id', () => {
    test('when device exists, should respond with device data', async () => {
      // arrange
      const deviceData = {
        name: 'Thermostat',
        status: 'active',
        description: 'Living room',
      };
      const result = await client
        .db()
        .collection('devices')
        .insertOne(deviceData);
      const deviceId = result.insertedId.toString();

      // act
      const response = await server.inject({
        method: 'GET',
        url: `/api/devices/${deviceId}`,
      });

      // assert
      expect(response.statusCode).toBe(200);
      expect(response.json()._id).toBe(deviceId);
      expect(response.json().name).toBe(deviceData.name);
      expect(response.json().description).toBe(deviceData.description);
    });

    test('when ID is invalid, should respond with 400', async () => {
      // act
      const response = await server.inject({
        method: 'GET',
        url: '/api/devices/invalid-id',
      });

      // assert
      expect(response.statusCode).toBe(400);
    });

    test('when device does not exist, should respond with 404', async () => {
      // act
      const response = await server.inject({
        method: 'GET',
        url: '/api/devices/123456789012345678901234',
      });

      // assert
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/devices/', () => {
    test('should respond with all devices', async () => {
      // arrange
      const deviceData1 = {
        name: 'Light switch',
        status: 'active',
        description: 'Hallway',
      };
      const deviceData2 = {
        name: 'Smart plug',
        status: 'active',
        description: 'Bedroom',
      };
      const deviceData3 = {
        name: 'Security camera',
        status: 'active',
        description: 'Front door',
      };
      await client
        .db()
        .collection('devices')
        .insertMany([deviceData1, deviceData2, deviceData3]);

      // act
      const response = await server.inject({
        method: 'GET',
        url: '/api/devices/',
      });

      // assert
      expect(response.statusCode).toBe(200);
      expect(response.json().length).toBe(3);
    });
  });

  describe('DELETE /api/devices/:_id', () => {
    test('when device exists, should delete device and respond with 204', async () => {
      // arrange
      const deviceData = { name: 'Smoke detector', description: 'Bedroom' };
      const result = await client
        .db()
        .collection('devices')
        .insertOne(deviceData);
      const deviceId = result.insertedId.toString();

      // act
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/devices/${deviceId}`,
      });

      // assert
      expect(response.statusCode).toBe(204);
      expect(
        client.db().collection('devices').findOne({ _id: result.insertedId })
      ).resolves.toBeNull();
    });

    test('when device does not exist, should respond with 404', async () => {
      // act
      const response = await server.inject({
        method: 'DELETE',
        url: '/api/devices/123456789012345678901234',
      });

      // assert
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/devices/:_id', () => {
    test('when device exists, should update device and respond with updated data', async () => {
      // arrange
      const deviceData = {
        name: 'Smart thermostat',
        status: 'active',
        description: 'Living room',
      };
      const result = await client
        .db()
        .collection('devices')
        .insertOne(deviceData);
      const deviceId = result.insertedId.toString();

      // act
      const response = await server.inject({
        method: 'PATCH',
        url: `/api/devices/${deviceId}`,
        payload: { status: 'inactive' },
      });

      // assert
      expect(response.statusCode).toBe(200);
      expect(response.json().status).toBe('inactive');
      expect(
        client.db().collection('devices').findOne({ _id: result.insertedId })
      ).resolves.toMatchObject({ ...deviceData, ...{ status: 'inactive' } });
    });

    test('when ID is invalid, should respond with 400', async () => {
      // act
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/devices/invalid-id',
        payload: { status: 'inactive' },
      });

      // assert
      expect(response.statusCode).toBe(400);
    });

    test('when device does not exist, should respond with 404', async () => {
      // act
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/devices/123456789012345678901234',
        payload: { status: 'inactive' },
      });

      // assert
      expect(response.statusCode).toBe(404);
    });
  });

  test('should respond to GET /actuator/health with status ok', async () => {
    // act
    const response = await server.inject({
      method: 'GET',
      url: '/actuator/health',
    });

    // assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});
