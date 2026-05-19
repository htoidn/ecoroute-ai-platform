export interface RecommendationMin {
    id: number | string;
    userId?: number | string | null;
    destinationId?: number | string | null;
    aiScore: number;
    reason?: string;
    user?: { id: number | string; username?: string } | null;
    destination?: { id: number | string; name?: string; country?: string } | null;
}

export interface DestinationMin {
    id: number | string;
    name?: string;
    country?: string;
}

export const getDestinationId = (rec: RecommendationMin): number | null => {
    const id = rec.destination?.id ?? rec.destinationId ?? null;
    if (id === null || id === undefined) return null;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
};

export const getUserId = (rec: RecommendationMin): number | null => {
    const id = rec.user?.id ?? rec.userId ?? null;
    if (id === null || id === undefined) return null;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
};

// destinationsMap: Map<number, DestinationMin>
export function getTop5DestinationsByAIScore(recommendations: RecommendationMin[], destinationsMap: Map<number, DestinationMin>) {
    const destScores: { [key: number]: { id: number; name: string; country: string; count: number; avgScore: number } } = {};

    recommendations.forEach(rec => {
        const destId = getDestinationId(rec);
        if (!destId) return;

        if (!destScores[destId]) {
            let destName = rec.destination?.name;
            let destCountry = rec.destination?.country;

            if (!destName || !destCountry) {
                const dest = destinationsMap.get(Number(destId));
                destName = destName || dest?.name || `Destination ${destId}`;
                destCountry = destCountry || dest?.country || 'Unknown';
            }

            destScores[destId] = {
                id: destId,
                name: destName,
                country: destCountry,
                count: 0,
                avgScore: 0,
            };
        }
        destScores[destId].count += 1;
        destScores[destId].avgScore += rec.aiScore;
    });

    return Object.values(destScores)
        .map(d => ({ ...d, avgScore: d.avgScore / d.count }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 5);
}

