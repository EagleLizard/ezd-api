
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectImageDtoSchema = Type.Object({
  jcd_project_image_id: Type.Number(),
  kind: Type.Union([
    Type.Literal('gallery'),
    Type.Literal('title'),
  ]),
  active: Type.Boolean(),
  path: Type.String(),
  sort_order: Type.Number(),
});

export type JcdProjectImageDtoType = Static<typeof JcdProjectImageDtoSchema>;

export const JcdProjectImageDto = {
  parse,
} as const;

function parse(val: unknown): JcdProjectImageDtoType {
  return Value.Parse(JcdProjectImageDtoSchema, val);
}
