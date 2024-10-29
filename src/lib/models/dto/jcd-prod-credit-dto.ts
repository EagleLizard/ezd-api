
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProdCreditDtoSchema = Type.Object({
  jcd_prod_credit_id: Type.Number(),
  label: Type.String(),
});

export type JcdProdCreditDtoType = Static<typeof JcdProdCreditDtoSchema>;

export const JcdProdCreditDto = {
  parse,
} as const;

function parse(val: unknown): JcdProdCreditDtoType {
  return Value.Parse(JcdProdCreditDtoSchema, val);
}
