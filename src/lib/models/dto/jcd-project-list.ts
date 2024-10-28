
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectListItemDtoSchema = Type.Object({
  projectKey: Type.String(),
  route: Type.String(),
  title: Type.String(),
  titleUri: Type.String(),
  orderIndex: Type.Number(),
});

export type JcdProjectListItemDtoType = Static<typeof JcdProjectListItemDtoSchema>;

export const JcdProjectListItemDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProjectListItemDtoType {
  return Value.Parse(JcdProjectListItemDtoSchema, val);
}
