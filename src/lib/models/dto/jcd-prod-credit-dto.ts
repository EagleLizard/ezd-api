
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProdCreditDtoSchema = Type.Object({
  jcd_prod_credit_id: Type.Number(),
  jcd_prod_credit_contrib_id: Type.Number(),
  label: Type.String(),
  name: Type.String(),
});

export type JcdProdCreditDtoType = Static<typeof JcdProdCreditDtoSchema>;

export const JcdProdCreditDto = {
  decode,
} as const;

function decode(val: unknown) {
  return Value.Decode(JcdProdCreditDtoSchema, val);
}
