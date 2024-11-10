
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdGalleryImageDtoSchema = Type.Object({
  jcd_gallery_image_id: Type.Number(),
  kind: Type.Union([
    Type.Literal('gallery'),
    Type.Literal('title'),
  ]),
  active: Type.Boolean(),
  path: Type.String(),
  sort_order: Type.Number(),
});

export type JcdGalleryImageDtoType = Static<typeof JcdGalleryImageDtoSchema>;

export const JcdGalleryImageDto = {
  decode,
} as const;

function decode(val: unknown) {
  return Value.Decode(JcdGalleryImageDtoSchema, val);
}
