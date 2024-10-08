
export function isObject(val: unknown): val is Record<string, unknown> {
  return (
    (val !== null)
    && ((typeof val) === 'object')
  );
}

export function isPromise(val: unknown): val is Promise<unknown> {
  if(!isObject(val)) {
    return false;
  }
  if(val instanceof Promise) {
    return true;
  }
  return ((typeof (val as any)?.then) === 'function');
}

export function isNumber(val: unknown): val is number {
  if(typeof val !== 'number') {
    return false;
  }
  return !isNaN(val);
}

export function isString(val: unknown): val is string {
  return (typeof val) === 'string';
}

export function isError(val: unknown): val is Error {
  return val instanceof Error;
}
