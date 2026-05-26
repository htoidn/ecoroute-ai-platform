import { describe, it, expect } from 'vitest';
import { getDestinationId, getUserId, getTop5DestinationsByAIScore } from '../../utils/recommendationHelpers';
import type { RecommendationMin, DestinationMin } from '../../utils/recommendationHelpers';

describe('recommendationHelpers', () => {
    describe('getDestinationId', () => {
        it('returns numeric id when destinationId is a number', () => {
            const rec: RecommendationMin = { id: 1, destinationId: 42, aiScore: 0 };
            expect(getDestinationId(rec)).toBe(42);
        });

        it('parses numeric id when destinationId is a string', () => {
            const rec: RecommendationMin = { id: 2, destinationId: '123', aiScore: 0 };
            expect(getDestinationId(rec)).toBe(123);
        });

        it('uses nested destination.id when present', () => {
            const rec: RecommendationMin = { id: 3, destination: { id: '77' }, aiScore: 0 };
            expect(getDestinationId(rec)).toBe(77);
        });

        it('returns null for missing id', () => {
            const rec: RecommendationMin = { id: 4, reason: 'no dest', aiScore: 0 };
            expect(getDestinationId(rec)).toBeNull();
        });

        it('returns null for non-numeric id', () => {
            const rec: RecommendationMin = { id: 5, destinationId: 'not-a-number', aiScore: 0 };
            expect(getDestinationId(rec)).toBeNull();
        });
    });

    describe('getUserId', () => {
        it('returns numeric id when userId is a number', () => {
            const rec: RecommendationMin = { id: 6, userId: 5, aiScore: 0 };
            expect(getUserId(rec)).toBe(5);
        });

        it('parses numeric id when userId is a string', () => {
            const rec: RecommendationMin = { id: 7, userId: '9', aiScore: 0 };
            expect(getUserId(rec)).toBe(9);
        });

        it('uses nested user.id when present', () => {
            const rec: RecommendationMin = { id: 8, user: { id: '11' }, aiScore: 0 };
            expect(getUserId(rec)).toBe(11);
        });

        it('returns null for missing id', () => {
            const rec: RecommendationMin = { id: 9, reason: 'no user', aiScore: 0 };
            expect(getUserId(rec)).toBeNull();
        });

        it('returns null for non-numeric id', () => {
            const rec: RecommendationMin = { id: 10, userId: 'x', aiScore: 0 };
            expect(getUserId(rec)).toBeNull();
        });
    });

    describe('getTop5DestinationsByAIScore', () => {
        it('computes averages, uses destinations map for names/countries and sorts by avgScore', () => {
            const recommendations: RecommendationMin[] = [
                { id: 1, destinationId: 10, aiScore: 80 },
                { id: 2, destinationId: '10', aiScore: 90 },
                { id: 3, destinationId: 20, aiScore: 70 },
                { id: 4, destinationId: 20, aiScore: 60 },
                { id: 5, destinationId: 30, aiScore: 100 },
            ];

            const destMap = new Map<number, DestinationMin>();
            destMap.set(10, { id: 10, name: 'City A', country: 'Aland' });
            destMap.set(20, { id: 20, name: 'City B', country: 'Bland' });
            destMap.set(30, { id: 30, name: 'City C', country: 'Cland' });

            const top5 = getTop5DestinationsByAIScore(recommendations, destMap);

            // Expect sorted by avg score: dest 30 (100), dest 10 (85), dest 20 (65)
            expect(top5.length).toBe(3);
            expect(top5[0].id).toBe(30);
            expect(top5[0].name).toBe('City C');
            expect(top5[0].country).toBe('Cland');
            expect(top5[0].avgScore).toBeCloseTo(100);

            expect(top5[1].id).toBe(10);
            expect(top5[1].name).toBe('City A');
            expect(top5[1].country).toBe('Aland');
            expect(top5[1].avgScore).toBeCloseTo(85);

            expect(top5[2].id).toBe(20);
            expect(top5[2].avgScore).toBeCloseTo(65);
        });

        it('falls back to recommendation-provided destination.name/country when map missing', () => {
            const recommendations: RecommendationMin[] = [
                { id: 1, destinationId: 50, aiScore: 75, destination: { id: 50, name: 'X', country: 'Y' } },
            ];
            const destMap = new Map<number, DestinationMin>();

            const top5 = getTop5DestinationsByAIScore(recommendations, destMap);
            expect(top5.length).toBe(1);
            expect(top5[0].name).toBe('X');
            expect(top5[0].country).toBe('Y');
        });
    });
});

