import { describe, it, expect } from 'vitest';
import { computeBounds, DEFAULT_MARGIN } from '../src/core/bounds';

describe('computeBounds', () => {
  it('uses default margins when none provided', () => {
    const b = computeBounds(400, 300);
    expect(b.margin).toEqual(DEFAULT_MARGIN);
    expect(b.innerWidth).toBe(400 - DEFAULT_MARGIN.left - DEFAULT_MARGIN.right);
    expect(b.innerHeight).toBe(300 - DEFAULT_MARGIN.top - DEFAULT_MARGIN.bottom);
  });

  it('merges a partial margin over the defaults', () => {
    const b = computeBounds(400, 300, { left: 100 });
    expect(b.margin.left).toBe(100);
    expect(b.margin.right).toBe(DEFAULT_MARGIN.right);
    expect(b.innerWidth).toBe(400 - 100 - DEFAULT_MARGIN.right);
  });

  it('clamps inner dimensions to zero for tiny containers', () => {
    const b = computeBounds(10, 10);
    expect(b.innerWidth).toBe(0);
    expect(b.innerHeight).toBe(0);
  });
});
