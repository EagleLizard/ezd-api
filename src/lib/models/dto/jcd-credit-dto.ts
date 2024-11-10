
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdCreditDtoSchema = Type.Object({
  jcd_credit_id: Type.Number(),
  jcd_credit_contrib_id: Type.Number(),
  label: Type.String(),
  name: Type.String(),
});

export type JcdCreditDtoType = Static<typeof JcdCreditDtoSchema>;

export const JcdCreditDto = {
  decode,
} as const;

function decode(val: unknown) {
  return Value.Decode(JcdCreditDtoSchema, val);
}
