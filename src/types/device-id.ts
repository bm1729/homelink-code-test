import { Static, Type } from '@sinclair/typebox';

const DeviceId = Type.Object({
  _id: Type.String({ pattern: '[a-fA-F\\d]{24}' }),
});

type DeviceIdType = Static<typeof DeviceId>;

export { DeviceId, DeviceIdType };
