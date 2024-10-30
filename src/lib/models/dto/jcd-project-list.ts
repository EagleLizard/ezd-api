
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { JcdProjectBaseDto } from './jcd-project-base-dto';

const JcdProjectListItemDtoSchema = Type.Composite([
  JcdProjectBaseDto.schema,
  Type.Object({
    title_uri: Type.String(),
    sort_order: Type.Number(),
  }),
]);

export type JcdProjectListItemDtoType = Static<typeof JcdProjectListItemDtoSchema>;

export const JcdProjectListItemDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProjectListItemDtoType {
  return Value.Parse(JcdProjectListItemDtoSchema, val);
}
