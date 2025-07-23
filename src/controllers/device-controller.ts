import { FastifyRequest, FastifyReply } from 'fastify';
import { DeviceType } from '../types/device';
import { DeviceIdType } from '../types/device-id';

async function createDevice(
  request: FastifyRequest<{ Body: Omit<DeviceType, '_id'> }>,
  reply: FastifyReply<{ Reply: DeviceType }>
) {
  const collection = request.server.mongo.db?.collection('devices');
  const device = await collection?.insertOne(request.body);

  if (!device || !device.acknowledged) {
    return reply.status(500).send();
  }

  reply.status(200).send({
    _id: device?.insertedId.toString(),
    ...request.body,
  });
}

async function getDevice(
  request: FastifyRequest<{ Params: DeviceIdType }>,
  reply: FastifyReply<{ Reply: DeviceType }>
) {
  const collection = request.server.mongo.db?.collection('devices');
  const objectId = new request.server.mongo.ObjectId(request.params._id);
  const device = await collection?.findOne({ _id: objectId });

  if (!device) {
    return reply.status(404).send();
  }

  reply.status(200).send({
    name: device.name,
    description: device.description,
    status: device.status,
    _id: device._id.toString(),
  });
}

async function getAllDevices(
  request: FastifyRequest,
  reply: FastifyReply<{ Reply: DeviceType[] }>
) {
  const collection = request.server.mongo.db?.collection('devices');
  const devices = await collection?.find().toArray();

  if (!devices) {
    return reply.status(500).send();
  }

  const response: DeviceType[] = devices.map((device) => ({
    _id: device._id.toString(),
    name: device.name,
    status: device.status,
    description: device.description,
  }));

  reply.status(200).send(response);
}

async function deleteDevice(
  request: FastifyRequest<{ Params: DeviceIdType }>,
  reply: FastifyReply
) {
  const collection = request.server.mongo.db?.collection('devices');
  const objectId = new request.server.mongo.ObjectId(request.params._id);
  const result = await collection?.deleteOne({ _id: objectId });

  if (!result || result.deletedCount === 0) {
    return reply.status(404).send();
  }

  reply.status(204).send();
}

async function updateDevice(
  request: FastifyRequest<{
    Params: DeviceIdType;
    Body: Pick<DeviceType, 'status'>;
  }>,
  reply: FastifyReply<{ Reply: DeviceType }>
) {
  const collection = request.server.mongo.db?.collection('devices');
  const objectId = new request.server.mongo.ObjectId(request.params._id);
  const device = await collection?.updateOne(
    { _id: objectId },
    { $set: request.body }
  );

  if (!device || device.matchedCount === 0) {
    return reply.status(404).send();
  }

  const updatedDevice = await collection?.findOne({ _id: objectId });

  if (!updatedDevice) {
    return reply.status(404).send();
  }

  reply.status(200).send({
    _id: updatedDevice._id.toString(),
    name: updatedDevice.name,
    status: updatedDevice.status,
    description: updatedDevice.description,
  });
}

export { createDevice, getDevice, getAllDevices, deleteDevice, updateDevice };
