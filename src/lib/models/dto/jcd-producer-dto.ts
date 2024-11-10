
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProduducerDtoSchema = Type.Object({
  jcd_producer_id: Type.Number(),
  name: Type.String(),
});

export type JcdProduducerDtoType = Static<typeof JcdProduducerDtoSchema>;

export const JcdProducerDto = {
  decode,
} as const;

function decode(val: unknown) {
  return Value.Decode(JcdProduducerDtoSchema, val);
}
