
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdPressDtoSchema = Type.Object({
  jcd_press_id: Type.Number(),
  publication_name: Type.String(),
  description: Type.Union([ Type.String(), Type.Null() ]),
  link_text: Type.String(),
  link_url: Type.String(),
});

export type JcdPressDtoType = Static<typeof JcdPressDtoSchema>;

export const JcdPressDto = {
  parse,
} as const;

function parse(val: unknown): JcdPressDtoType {
  return Value.Parse(JcdPressDtoSchema, val);
}
