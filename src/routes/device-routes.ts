import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyMongo from '@fastify/mongodb';
import {
  createDevice,
  deleteDevice,
  getAllDevices,
  getDevice,
  updateDevice,
} from '../controllers/device-controller';
import { Device, DeviceType } from '../types/device';
import { DeviceId, DeviceIdType } from '../types/device-id';
import { Type } from '@sinclair/typebox';

async function routes(server: FastifyInstance, opts: FastifyPluginOptions) {
  await server.register(fastifyMongo, { url: opts.mongoUri });

  server.post<{ Body: Omit<DeviceType, '_id'>; Reply: DeviceType }>(
    '/',
    {
      schema: {
        body: Type.Omit(Device, ['_id']),
        response: {
          200: Device,
        },
      },
    },
    createDevice
  );

  server.get<{ Params: DeviceIdType; Reply: DeviceType }>(
    '/:_id',
    {
      schema: {
        params: DeviceId,
        response: {
          200: Device,
        },
      },
    },
    getDevice
  );

  server.get<{ Reply: DeviceType[] }>(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: Device,
          },
        },
      },
    },
    getAllDevices
  );

  server.delete<{ Params: DeviceIdType }>(
    '/:_id',
    {
      schema: {
        params: DeviceId,
        response: {
          204: { type: 'null' },
        },
      },
    },
    deleteDevice
  );

  server.patch<{
    Params: DeviceIdType;
    Body: Pick<DeviceType, 'status'>;
    Reply: DeviceType;
  }>(
    '/:_id',
    {
      schema: {
        params: DeviceId,
        body: Type.Pick(Device, ['status']),
        response: {
          200: Device,
        },
      },
    },
    updateDevice
  );
}

export default routes;
