
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { JcdProjectBaseDto } from './jcd-project-base-dto';

const JcdProjectListItemDtoSchema = Type.Composite([
  JcdProjectBaseDto.schema,
  Type.Object({
    title_uri: Type.Union([
      Type.String(),
      Type.Null(),
    ]),
    sort_order: Type.Number(),
  }),
]);

export type JcdProjectListItemDtoType = Static<typeof JcdProjectListItemDtoSchema>;

export const JcdProjectListItemDto = {
  decode,
} as const;

function decode(val: unknown) {
  return Value.Decode(JcdProjectListItemDtoSchema, val);
}
