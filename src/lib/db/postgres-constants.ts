
export enum PG_ERROR_ENUM {
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
}

export const PG_ERRORS: Record<string, PG_ERROR_ENUM> = {
  '23505': PG_ERROR_ENUM.DUPLICATE_VALUE,
};
