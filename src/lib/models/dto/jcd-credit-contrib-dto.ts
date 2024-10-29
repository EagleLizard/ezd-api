
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdCreditContribDtoSchema = Type.Object({
  jcd_credit_contrib_id: Type.Number(),
  name: Type.String(),
});

export type JcdCreditContribDtoType = Static<typeof JcdCreditContribDtoSchema>;

export const JcdCreditContribDto = {
  parse,
} as const;

function parse(val: unknown): JcdCreditContribDtoType {
  return Value.Parse(JcdCreditContribDtoSchema, val);
}
