import { Static, Type } from '@sinclair/typebox';

export const Device = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: 'email' })),
});

export type DeviceType = Static<typeof Device>;
