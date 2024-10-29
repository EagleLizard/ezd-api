
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectDescDtoSchema = Type.Object({
  jcd_project_description_id: Type.Number(),
  description_id: Type.Number(),
  text: Type.String(),
});

export type JcdProjectDescDtoType = Static<typeof JcdProjectDescDtoSchema>;

export const JcdProjectDescDto = {
  parse,
} as const;

function parse(val: unknown): JcdProjectDescDtoType {
  return Value.Parse(JcdProjectDescDtoSchema, val);
}
