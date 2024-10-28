
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectDtoSchema = Type.Object({
  project_key: Type.String(),
  route: Type.String(),
  title: Type.String(),
  project_date: Type.Date(),
  venue: Type.String(),
  description: Type.String(),
});

export type JcdProjectDtoType = Static<typeof JcdProjectDtoSchema>;

export const JcdProjectDto = {
  parse,
} as const;

function parse(val: unknown): JcdProjectDtoType {
  return Value.Parse(JcdProjectDtoSchema, val);
}
