import { Static, Type } from '@sinclair/typebox';
import { DeviceId } from './device-id';

const Device = Type.Intersect([
  Type.Object({
    name: Type.String(),
    status: Type.String(),
    description: Type.Optional(Type.String()),
  }),
  DeviceId,
]);

type DeviceType = Static<typeof Device>;

export { Device, DeviceType };
