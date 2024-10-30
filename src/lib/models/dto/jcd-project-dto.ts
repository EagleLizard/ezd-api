
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { JcdProjectBaseDto } from './jcd-project-base-dto';

const JcdProjectDtoSchema = Type.Composite([
  JcdProjectBaseDto.schema,
  Type.Object({
    venue: Type.String(),
  }),
]);

export type JcdProjectDtoType = Static<typeof JcdProjectDtoSchema>;

export const JcdProjectDto = {
  parse,
} as const;

function parse(val: unknown): JcdProjectDtoType {
  return Value.Parse(JcdProjectDtoSchema, val);
}
