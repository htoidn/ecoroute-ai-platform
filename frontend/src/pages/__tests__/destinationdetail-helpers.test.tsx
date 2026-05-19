import { describe, it, expect } from 'vitest';
import { normalizeDestinationId, getAiScore } from '../DestinationDetail';

describe('normalizeDestinationId', () => {
  it('returns number when destinationId is numeric', () => {
    expect(normalizeDestinationId({ destinationId: 123 })).toBe(123);
  });

  it('parses numeric string destinationId', () => {
    expect(normalizeDestinationId({ destinationId: '45' })).toBe(45);
  });

  it('reads nested destination.id', () => {
    expect(normalizeDestinationId({ destination: { id: '67' } })).toBe(67);
  });

  it('returns null for missing id', () => {
    expect(normalizeDestinationId({ foo: 'bar' })).toBeNull();
  });

  it('returns null for null/undefined rec', () => {
    expect(normalizeDestinationId(null)).toBeNull();
    expect(normalizeDestinationId(undefined)).toBeNull();
  });
});

describe('getAiScore', () => {
  it('returns numeric aiScore when present', () => {
    expect(getAiScore({ aiScore: 88 })).toBe(88);
  });

  it('supports snake_case ai_score', () => {
    expect(getAiScore({ ai_score: '92' })).toBe(92);
  });

  it('parses numeric string aiScore', () => {
    expect(getAiScore({ aiScore: '77' })).toBe(77);
  });

  it('returns 0 when missing or non-numeric', () => {
    expect(getAiScore({})).toBe(0);
    expect(getAiScore({ aiScore: 'not-a-number' })).toBe(0);
  });
});

