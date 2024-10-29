
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProduducerDtoSchema = Type.Object({
  jcd_producer_id: Type.Number(),
  name: Type.String(),
});

export type JcdProduducerDtoType = Static<typeof JcdProduducerDtoSchema>;

export const JcdProducerDto = {
  parse,
} as const;

function parse(val: unknown): JcdProduducerDtoType {
  return Value.Parse(JcdProduducerDtoSchema, val);
}
