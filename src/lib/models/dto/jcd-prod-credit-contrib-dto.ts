
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProdCreditContribDtoSchema = Type.Object({
  jcd_prod_credit_contrib_id: Type.Number(),
  name: Type.String(),
});

export type JcdProdCreditContribDtoType = Static<typeof JcdProdCreditContribDtoSchema>;

export const JcdProdCreditContribDto = {
  parse,
} as const;

function parse(val: unknown): JcdProdCreditContribDtoType {
  return Value.Parse(JcdProdCreditContribDtoSchema, val);
}
