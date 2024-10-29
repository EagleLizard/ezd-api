
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdCreditDtoSchema = Type.Object({
  jcd_credit_id: Type.Number(),
  label: Type.String(),
});

export type JcdCreditDtoType = Static<typeof JcdCreditDtoSchema>;

export const JcdCreditDto = {
  parse,
} as const;

function parse(val: unknown): JcdCreditDtoType {
  return Value.Parse(JcdCreditDtoSchema, val);
}
