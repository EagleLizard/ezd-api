
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const JcdProjectVenueDtoSchema = Type.Object({
  jcd_project_venue_id: Type.Number(),
  name: Type.String(),
});

export type JcdProjectVenueDtoType = Static<typeof JcdProjectVenueDtoSchema>;

export const JcdProjectVenueDto = {
  parse,
} as const;

function parse(val: unknown): JcdProjectVenueDtoType {
  return Value.Parse(JcdProjectVenueDtoSchema, val);
}
