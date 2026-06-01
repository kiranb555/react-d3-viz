import type { Datum } from './types';

/** An accessor is either a key into a datum or a function returning the value. */
export type Accessor<T> = string | ((d: Datum, index: number) => T);

export function makeAccessor<T>(accessor: Accessor<T>): (d: Datum, i: number) => T {
  if (typeof accessor === 'function') return accessor;
  return (d: Datum) => d[accessor] as T;
}

/** Pull a numeric value out of a datum via key or function; NaN if missing. */
export function getNumber(d: Datum, accessor: Accessor<number>, index: number): number {
  const raw = makeAccessor<unknown>(accessor)(d, index);
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

/** Pull a category/label value out of a datum as a string. */
export function getCategory(d: Datum, accessor: Accessor<unknown>, index: number): string {
  return String(makeAccessor<unknown>(accessor)(d, index));
}
