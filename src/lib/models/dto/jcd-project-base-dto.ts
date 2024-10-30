
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectBaseDtoSchema = Type.Object({
  jcd_project_id: Type.Number(),
  project_key: Type.String(),
  route: Type.String(),
  title: Type.String(),
  project_date: Type.Date(),
});

export type JcdProjectBaseDtoType = Static<typeof JcdProjectBaseDtoSchema>;

export const JcdProjectBaseDto = {
  parse,
  schema: JcdProjectBaseDtoSchema,
} as const;

function parse(val: unknown): JcdProjectBaseDtoType {
  return Value.Parse(JcdProjectBaseDtoSchema, val);
}
