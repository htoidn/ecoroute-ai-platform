import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {getDestinationById, getAllRecommendations, getAllDestinations} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { useLocalization } from '../contexts/LocalizationContext';
import {Badge, EmptyState, LoadingSpinner} from '../styles/SharedStyles';

interface Destination {
    id: number;
    name: string;
    country: string;
    description: string;
    sustainabilityScore: number;
    costIndex: number;
    crowdIndex: number;
    co2PerTrip: number;
    publicTransportScore: number;
    avgTemp: number;
    bestSeason: string;
    tags: string;
    latitude?: number;
    longitude?: number;
}

interface Recommendation {
    id: number;
    userId: number;
    destinationId: number;
    aiScore: number;
    reason?: string;
}

interface TopDest {
    id: number;
    name: string;
    country: string;
    avgScore: number;
    count: number;
    // include a few destination fields so the Top-5 cards can display richer data
    sustainabilityScore?: number;
    costIndex?: number;
    publicTransportScore?: number;
    crowdIndex?: number;
    description?: string;
}

// small helpers to avoid `any` casts and normalize recommendation fields
export function normalizeDestinationId(rec: unknown): number | null {
    if (!rec || typeof rec !== 'object') return null;
    const obj = rec as Record<string, unknown>;
    const nested = obj['destination'] && typeof obj['destination'] === 'object' ? (obj['destination'] as Record<string, unknown>)['id'] : undefined;
    const raw = obj['destinationId'] ?? nested;
    if (raw === null || raw === undefined) return null;
    const n = Number(raw as unknown as string | number);
    return Number.isNaN(n) ? null : n;
}

export function getAiScore(rec: unknown): number {
    if (!rec || typeof rec !== 'object') return 0;
    const obj = rec as Record<string, unknown>;
    const raw = obj['aiScore'] ?? obj['ai_score'];
    const n = Number(raw as unknown as string | number);
    return Number.isNaN(n) ? 0 : n;
}

const Container = styled.div`
    min-height: 100vh;
    background: ${props => props.theme?.colors?.bg || '#f8fafc'};
`;

const BackButton = styled.button`
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 0.75rem 1.5rem;
    background: ${props => props.theme?.colors?.primary || '#48bb78'};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    z-index: 100;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }

    @media (max-width: 768px) {
        top: 10px;
        left: 10px;
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }
`;

// use a transient prop ($imageId) so the numeric id isn't forwarded to the DOM
const HeroSection = styled.div<{ $imageId?: number }>`
    position: relative;
    height: 400px;
    background: linear-gradient(135deg, #48bb78, #38a169);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('https://picsum.photos/1200/400?random=${props => props.$imageId || 1}');
        background-size: cover;
        background-position: center;
        opacity: 0.7;
    }

    @media (max-width: 768px) {
        height: 250px;
    }
`;

const HeroOverlay = styled.div`
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 3rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);

    @media (max-width: 768px) {
        padding: 2rem;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin: 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.3rem;
    color: #e0e7ff;
    margin: 0.5rem 0 0 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const ContentSection = styled.div`
    max-width: 1200px;
    margin: -50px auto 0;
    position: relative;
    z-index: 10;
    padding: 0 2rem;

    @media (max-width: 768px) {
        padding: 0 1rem;
        margin-top: -30px;
    }
`;

const MainCard = styled.div`
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const Description = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    margin-bottom: 2rem;
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
`;

const MetricCard = styled.div`
    background: linear-gradient(135deg, #f0fdf4, #f0fdf4);
    padding: 2rem;
    border-radius: 12px;
    border-left: 4px solid ${props => props.color || '#48bb78'};

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const MetricLabel = styled.div`
    font-size: 0.85rem;
    font-weight: 600;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
    font-size: 2.5rem;
    font-weight: 800;
    color: ${props => props.color || '#48bb78'};

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const MetricUnit = styled.span`
    font-size: 0.9rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    margin-left: 0.5rem;
    font-weight: 600;
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const InfoItem = styled.div`
    padding: 1.5rem;
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    border-radius: 12px;
    border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};

    .label {
        font-weight: 600;
        color: ${props => props.theme?.colors?.textSecondary || '#718096'};
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .value {
        font-size: 1.2rem;
        color: ${props => props.theme?.colors?.text || '#1a202c'};
        font-weight: 600;
    }
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
`;

const ScoreVisualization = styled.div`
    margin-top: 2rem;
`;

const ScoreItem = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 100px 1fr;
    }
`;

const ScoreLabel = styled.div`
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
`;

const ScoreBar = styled.div`
    height: 30px;
    background: ${props => props.theme?.colors?.border || '#e2e8f0'};
    border-radius: 15px;
    overflow: hidden;
    position: relative;

    @media (max-width: 768px) {
        height: 25px;
    }
`;

const ScoreFill = styled.div<{ width: number; color: string }>`
    height: 100%;
    width: ${props => props.width}%;
    background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}dd);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.75rem;
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
    transition: width 0.5s ease;

    @media (max-width: 768px) {
        font-size: 0.75rem;
    }
`;

const RecommendationBox = styled.div`
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    padding: 2rem;
    border-radius: 12px;
    margin-top: 2rem;
    border-left: 4px solid #3b82f6;

    h3 {
        color: #0f172a;
        margin-top: 0;
        font-size: 1.2rem;
    }

    p {
        color: #1e293b;
        line-height: 1.6;
        margin: 0;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
        h3 {
            font-size: 1rem;
        }
    }
`;

const PageTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${props => props.theme?.colors?.text || '#1a202c'};

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`;

export default function DestinationDetail() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {theme} = useTheme();
    const { showToast } = useNotification();
    const { t } = useLocalization();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [top5, setTop5] = useState<TopDest[]>([]);
    const [related, setRelated] = useState<Destination[]>([]);
    const [loadingTop, setLoadingTop] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);

    // Effect 1: fetch destination for the given `id` and set `destination` state
    useEffect(() => {
        let mounted = true;

        (async () => {
            setLoading(true);
            try {
                if (id) {
                    const parsed = parseInt(id);
                    if (isNaN(parsed)) {
                        console.warn('Invalid destination id in URL:', id);
                        if (mounted) setDestination(null);
                        return;
                    }
                    const res = await getDestinationById(parsed);
                    if (mounted) setDestination(res.data);

                    // also eagerly load top5 and related right after fetching the destination
                    try {
                        setLoadingTop(true);
                        setLoadingRelated(true);
                        const [recsResp, destsResp] = await Promise.all([getAllRecommendations(), getAllDestinations()]);
                        const recs: Recommendation[] = recsResp.data;
                        const dests: Destination[] = destsResp.data;

                        // compute top 5 by avg ai score (normalize ids)
                        const scores: {[key: number]: {id: number; name: string; country: string; count: number; total: number; dest?: Destination}} = {};
                        recs.forEach(r => {
                            const destIdNum = normalizeDestinationId(r);
                            if (destIdNum === null) return;

                            if (!scores[destIdNum]) {
                                const d = dests.find(dd => dd.id === destIdNum);
                                scores[destIdNum] = {
                                    id: destIdNum,
                                    name: d?.name || `Destination ${destIdNum}`,
                                    country: d?.country || 'Unknown',
                                    count: 0,
                                    total: 0,
                                    dest: d,
                                };
                            }
                            scores[destIdNum].count += 1;
                            scores[destIdNum].total += getAiScore(r);
                        });

                        const top = Object.values(scores)
                            .map(s => ({
                                id: s.id,
                                name: s.name,
                                country: s.country,
                                avgScore: s.total / s.count,
                                count: s.count,
                                sustainabilityScore: s.dest?.sustainabilityScore,
                                costIndex: s.dest?.costIndex,
                                publicTransportScore: s.dest?.publicTransportScore,
                                crowdIndex: s.dest?.crowdIndex,
                                description: s.dest?.description,
                            }))
                            .sort((a, b) => b.avgScore - a.avgScore)
                            .slice(0, 5);

                        if (mounted) setTop5(top);

                        // compute related for this destination
                        const curDest = res.data as Destination;
                        if (curDest) {
                            const currentTags = (curDest.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                            // Filter destinations excluding current one and deduplicate
                            const uniqueDests = new Map<number, Destination>();
                            dests.forEach(d => {
                                if (d.id !== curDest.id && !uniqueDests.has(d.id)) {
                                    uniqueDests.set(d.id, d);
                                }
                            });

                                const computeRelated = (candidates: Destination[], reference: Destination, limit = 5) => {
                                    // Score and rank candidates by shared tags, country, cost similarity, and sustainability distance.
                                    const scored = candidates.map(d => {
                                        const tags = (d.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                                        const shared = tags.filter(t => currentTags.includes(t)).length;
                                        const sameCountry = d.country === reference.country ? 3 : 0;
                                        const scoreDiff = Math.abs((d.sustainabilityScore || 0) - (reference.sustainabilityScore || 0));
                                        const costSimilarity = Math.abs((d.costIndex || 0) - (reference.costIndex || 0)) < 20 ? 1 : 0;
                                        const finalScore = (shared * 3 + sameCountry + costSimilarity) - (scoreDiff / 20);
                                        return {d, score: finalScore};
                                    }).sort((a, b) => (b.score - a.score) || ((b.d.sustainabilityScore || 0) - (a.d.sustainabilityScore || 0)));

                                    // Deduplicate strictly by id to avoid returning the same destination multiple times.
                                    const seen = new Set<number>();
                                    const result: Destination[] = [];
                                    for (const item of scored) {
                                        const id = item.d.id;
                                        if (seen.has(id)) continue;
                                        seen.add(id);
                                        result.push(item.d);
                                        if (result.length >= limit) break;
                                    }
                                    return result;
                                };

                                const relatedCandidates = Array.from(uniqueDests.values());
                                const scoredRelated = computeRelated(relatedCandidates, curDest, 5);

                                if (mounted) setRelated(scoredRelated);
                        }
                        if (mounted) {
                            setLoadingTop(false);
                            setLoadingRelated(false);
                        }
                    } catch (err) {
                        console.error('Failed to eagerly load top/related data:', err);
                        if (mounted) {
                            setLoadingTop(false);
                            setLoadingRelated(false);
                        }
                    }
                } else {
                    if (mounted) setDestination(null);
                }
            } catch (error) {
                console.error('Failed to load destination:', error);
                if (mounted) setDestination(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);

    // Effect 2: compute top5 and related destinations whenever `destination` changes
    useEffect(() => {
        let mounted = true;

        (async () => {
                try {
                setLoadingTop(true);
                setLoadingRelated(true);
                const [recsResp, destsResp] = await Promise.all([getAllRecommendations(), getAllDestinations()]);
                const recs: Recommendation[] = recsResp.data;
                const dests: Destination[] = destsResp.data;

                // compute top 5 by avg ai score (normalize ids)
                const scores: {[key: number]: {id: number; name: string; country: string; count: number; total: number; dest?: Destination}} = {};
                recs.forEach(r => {
                    const destIdNum = normalizeDestinationId(r);
                    if (destIdNum === null) return;

                    if (!scores[destIdNum]) {
                        const d = dests.find(dd => dd.id === destIdNum);
                        scores[destIdNum] = {
                            id: destIdNum,
                            name: d?.name || `Destination ${destIdNum}`,
                            country: d?.country || 'Unknown',
                            count: 0,
                            total: 0,
                            dest: d,
                        };
                    }
                    scores[destIdNum].count += 1;
                    scores[destIdNum].total += getAiScore(r);
                });

                const top = Object.values(scores)
                    .map(s => ({
                        id: s.id,
                        name: s.name,
                        country: s.country,
                        avgScore: s.total / s.count,
                        count: s.count,
                        sustainabilityScore: s.dest?.sustainabilityScore,
                        costIndex: s.dest?.costIndex,
                        publicTransportScore: s.dest?.publicTransportScore,
                        crowdIndex: s.dest?.crowdIndex,
                        description: s.dest?.description,
                    }))
                    .sort((a, b) => b.avgScore - a.avgScore)
                    .slice(0, 5);

                if (mounted) setTop5(top);
                if (mounted) setLoadingTop(false);

                  // compute related destinations if we have a current destination
                  if (mounted && destination) {
                      const currentTags = (destination.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                      // Filter destinations excluding current one and deduplicate by ID
                      const uniqueDests = new Map<number, Destination>();
                      dests.forEach(d => {
                          if (d.id !== destination.id && !uniqueDests.has(d.id)) {
                              uniqueDests.set(d.id, d);
                          }
                      });

                       const computeRelated = (candidates: Destination[], reference: Destination, limit = 5) => {
                           const scored = candidates.map(d => {
                               const tags = (d.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                               const shared = tags.filter(t => currentTags.includes(t)).length;
                               const sameCountry = d.country === reference.country ? 3 : 0;
                               const scoreDiff = Math.abs((d.sustainabilityScore || 0) - (reference.sustainabilityScore || 0));
                               const costSimilarity = Math.abs((d.costIndex || 0) - (reference.costIndex || 0)) < 20 ? 1 : 0;
                               const finalScore = (shared * 3 + sameCountry + costSimilarity) - (scoreDiff / 20);
                               return {d, score: finalScore};
                           }).sort((a, b) => (b.score - a.score) || ((b.d.sustainabilityScore || 0) - (a.d.sustainabilityScore || 0)));

                           const seen = new Set<number>();
                           const result: Destination[] = [];
                           for (const item of scored) {
                               const id = item.d.id;
                               if (seen.has(id)) continue;
                               seen.add(id);
                               result.push(item.d);
                               if (result.length >= limit) break;
                           }
                           return result;
                       };

                       const relatedCandidates = Array.from(uniqueDests.values());
                       const scoredRelated = computeRelated(relatedCandidates, destination, 5);

                      if (mounted) setRelated(scoredRelated);
                       if (mounted) setLoadingRelated(false);
                   } else {
                       if (mounted) setRelated([]);
                       if (mounted) setLoadingRelated(false);
                   }
            } catch (error) {
                console.error('Failed to load destination/top/related data:', error);
                if (mounted) {
                    setTop5([]);
                    setRelated([]);
                    setLoadingTop(false);
                    setLoadingRelated(false);
                }
            }
        })();

        return () => { mounted = false; };
    }, [destination, id]);


    if (loading) {
        return (
            <Container theme={theme}>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>{t('destination.loading') ?? 'Loading destination details...'}</p>
                </LoadingSpinner>
            </Container>
        );
    }

    if (!destination) {
        return (
            <Container theme={theme}>
                <BackButton onClick={() => navigate(-1)}>{t('destination.back') ?? '← Go Back'}</BackButton>
                <EmptyState style={{marginTop: '100px'}}>
                    <div className="icon">🗺️</div>
                    <h3>{t('destination.not_found') ?? 'Destination not found'}</h3>
                    <p>{t('destination.not_found_help') ?? "Sorry, we couldn't find the destination you're looking for."}</p>
                </EmptyState>
            </Container>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#48bb78';
        if (score >= 75) return '#f6ad55';
        return '#fc8181';
    };

    const tags = destination.tags?.split(',').map((tag: string) => tag.trim()).filter(tag => tag) || [];

    return (
        <Container theme={theme}>
            <BackButton onClick={() => navigate(-1)}>{t('destination.back')}</BackButton>

            <HeroSection $imageId={destination.id}>
                <HeroOverlay>
                    <HeroTitle>{destination.name}</HeroTitle>
                    <HeroSubtitle>🌍 {destination.country}</HeroSubtitle>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <MainCard theme={theme}>
                    <Description>{destination.description}</Description>

                    <ScoreVisualization>
                                <PageTitle>{t('destination.sustainability_metrics')}</PageTitle>

                        <ScoreItem>
                             <ScoreLabel>♻️ {t('metric.sustainability') ?? 'Sustainability'}</ScoreLabel>
                            <ScoreBar>
                                <ScoreFill
                                    width={destination.sustainabilityScore}
                                    color="#48bb78"
                                >
                                    {destination.sustainabilityScore}%
                                </ScoreFill>
                            </ScoreBar>
                        </ScoreItem>

                        <ScoreItem>
                             <ScoreLabel>🚆 {t('metric.public_transport') ?? 'Public Transport'}</ScoreLabel>
                            <ScoreBar>
                                <ScoreFill
                                    width={destination.publicTransportScore}
                                    color="#3b82f6"
                                >
                                    {destination.publicTransportScore}%
                                </ScoreFill>
                            </ScoreBar>
                        </ScoreItem>

                        <ScoreItem>
                             <ScoreLabel>🌍 {t('metric.co2_impact') ?? 'CO₂ Impact'}</ScoreLabel>
                            <ScoreBar>
                                <ScoreFill
                                    width={100 - (destination.co2PerTrip / 200) * 100}
                                    color={getScoreColor(100 - (destination.co2PerTrip / 200) * 100)}
                                >
                                    {(100 - (destination.co2PerTrip / 200) * 100).toFixed(0)}%
                                </ScoreFill>
                            </ScoreBar>
                        </ScoreItem>

                        <ScoreItem>
                             <ScoreLabel>👥 {t('metric.crowd_level') ?? 'Crowd Level'}</ScoreLabel>
                            <ScoreBar>
                                <ScoreFill
                                    width={100 - destination.crowdIndex}
                                    color={getScoreColor(100 - destination.crowdIndex)}
                                >
                                    {(100 - destination.crowdIndex).toFixed(0)}%
                                </ScoreFill>
                            </ScoreBar>
                        </ScoreItem>
                    </ScoreVisualization>

                    <MetricsGrid>
                        <MetricCard color="#48bb78" theme={theme}>
                             <MetricLabel theme={theme}>{t('metric.sustainability_score') ?? 'Sustainability Score'}</MetricLabel>
                            <MetricValue color="#48bb78">
                                {destination.sustainabilityScore}
                                <MetricUnit theme={theme}>/ 100</MetricUnit>
                            </MetricValue>
                            <p style={{margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#48bb78'}}>
                                ★★★★★ Excellent for eco-conscious travelers
                            </p>
                        </MetricCard>

                        <MetricCard color="#3b82f6" theme={theme}>
                             <MetricLabel theme={theme}>{t('metric.cost_index') ?? 'Cost Index'}</MetricLabel>
                            <MetricValue color="#3b82f6">
                                ${destination.costIndex}
                                <MetricUnit theme={theme}> / day</MetricUnit>
                            </MetricValue>
                            <p style={{margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#3b82f6'}}>
                                {destination.costIndex < 60 ? '💰 Budget-friendly' : destination.costIndex < 80 ? '💵 Moderate' : '💎 Premium'}
                            </p>
                        </MetricCard>

                        <MetricCard color="#8b5cf6" theme={theme}>
                             <MetricLabel theme={theme}>{t('metric.temperature') ?? 'Temperature'}</MetricLabel>
                            <MetricValue color="#8b5cf6">
                                {destination.avgTemp}
                                <MetricUnit theme={theme}>°C</MetricUnit>
                            </MetricValue>
                            <p style={{margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#8b5cf6'}}>
                                Best season: <strong>{destination.bestSeason}</strong>
                            </p>
                        </MetricCard>
                    </MetricsGrid>

                    <InfoGrid>
                        <InfoItem theme={theme}>
                            <div className="label">{t('info.co2_per_trip') ?? 'CO₂ per trip'}</div>
                            <div className="value">{destination.co2PerTrip} kg</div>
                        </InfoItem>
                        <InfoItem theme={theme}>
                            <div className="label">{t('info.public_transport_score') ?? 'Public Transport Score'}</div>
                            <div className="value">{destination.publicTransportScore}/100</div>
                        </InfoItem>
                        <InfoItem theme={theme}>
                            <div className="label">{t('info.crowd_index') ?? 'Crowd Index'}</div>
                            <div className="value">{destination.crowdIndex}/100</div>
                        </InfoItem>
                        <InfoItem theme={theme}>
                            <div className="label">{t('info.best_season') ?? 'Best Season'}</div>
                            <div className="value">{destination.bestSeason}</div>
                        </InfoItem>
                        {destination.latitude && (
                            <InfoItem theme={theme}>
                                <div className="label">Latitude</div>
                                <div className="value">{destination.latitude.toFixed(2)}°</div>
                            </InfoItem>
                        )}
                        {destination.longitude && (
                            <InfoItem theme={theme}>
                                <div className="label">Longitude</div>
                                <div className="value">{destination.longitude.toFixed(2)}°</div>
                            </InfoItem>
                        )}
                    </InfoGrid>

                    {tags.length > 0 && (
                        <div>
                             <PageTitle style={{marginTop: '2rem'}}>{t('destination.tags_and_categories')}</PageTitle>
                            <TagsContainer>
                                {tags.map((tag, index) => (
                                    <Badge key={index} color="green">
                                        #{tag}
                                    </Badge>
                                ))}
                            </TagsContainer>
                        </div>
                    )}

                    <RecommendationBox>
                        <h3>{t('destination.why_visit_title', { name: destination.name })}</h3>
                        <p>
                            {t('destination.why_visit_summary', { score: destination.sustainabilityScore, pt: destination.publicTransportScore })}
                            {' '}
                            {destination.crowdIndex < 70 ? (t('destination.peaceful') ?? 'peaceful atmosphere') : (t('destination.vibrant') ?? 'vibrant energy')}
                            {' '}
                            {t('destination.why_visit_extra') ?? 'makes it an ideal choice for sustainable tourism.'}
                        </p>
                    </RecommendationBox>
                    <div style={{marginTop: '2rem'}}>
                        <PageTitle style={{marginBottom: '1rem'}}>{t('destination.related')}</PageTitle>
                        {loadingRelated ? (
                            <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                                {[1,2,3].map(i => (
                                    <div key={i} style={{background: theme.colors.bgSecondary, padding: '0.75rem 1rem', borderRadius: 10, border: `1px solid ${theme.colors.border}`, minWidth: 220, height: 110, display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.6}} />
                                ))}
                            </div>
                        ) : related.length > 0 ? (
                            <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                                {related.map(r => (
                                    <div key={r.id} style={{background: theme.colors.cardBg, padding: '0.75rem 1rem', borderRadius: 10, border: `1px solid ${theme.colors.border}`, minWidth: 220, display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                                        <img src={`https://picsum.photos/120/80?random=${r.id + 9000}`} alt={r.name} style={{width: 100, height: 64, objectFit: 'cover', borderRadius: 8}} />
                                        <div style={{flex: 1}}>
                                            <div style={{fontWeight: 700}}>{r.name}</div>
                                            <div style={{fontSize: '0.85rem', color: theme.colors.textSecondary}}>🌍 {r.country}</div>
                                            <div style={{fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '0.5rem'}}>Sustainability: {r.sustainabilityScore}/100 • Cost: ${r.costIndex?.toFixed?.(2) ?? r.costIndex}</div>
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
                                            <Badge color="green">{r.sustainabilityScore}</Badge>
                                            <button onClick={() => navigate(`/destination/${r.id}`)} style={{background: theme.colors.primary, color: 'white', border: 'none', padding: '0.35rem 0.5rem', borderRadius: 8, fontWeight: 700}}>View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{padding: '1rem', color: theme.colors.textSecondary}}>{t('destination.related_none') ?? 'No related destinations found.'}</div>
                        )}
                    </div>
                    <div style={{marginTop: '2rem'}}>
                        <PageTitle style={{marginBottom: '1rem'}}>{t('destination.top5')}</PageTitle>
                        {loadingTop ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'}}>
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} style={{background: theme.colors.bgSecondary, padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.colors.border}`, height: 140, opacity: 0.6}} />
                                ))}
                            </div>
                        ) : top5.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'}}>
                                {top5.map((d) => (
                                    <div key={d.id} style={{background: theme.colors.cardBg, padding: '1rem', borderRadius: '12px', border: `1px solid ${theme.colors.border}`}}>
                                        <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                                            <img src={`https://picsum.photos/120/80?random=${d.id + 8000}`} alt={d.name} style={{width: 100, height: 64, objectFit: 'cover', borderRadius: 8}} />
                                            <div style={{flex: 1}}>
                                                <div style={{fontWeight: 700}}>{d.name}</div>
                                                <div style={{fontSize: '0.85rem', color: theme.colors.textSecondary}}>🌍 {d.country}</div>
                                                <div style={{fontSize: '0.8rem', color: theme.colors.textSecondary, marginTop: 6}}>
                                                    {d.description ? (d.description.length > 120 ? d.description.slice(0, 117) + '...' : d.description) : ''}
                                                </div>
                                                <div style={{display: 'flex', gap: '0.5rem', marginTop: 8, alignItems: 'center'}}>
                                                    <Badge color="green">S:{d.sustainabilityScore ?? '—'}</Badge>
                                                    <div style={{fontSize: '0.8rem', color: theme.colors.textSecondary}}>💶 ${d.costIndex ?? '—'}</div>
                                                    <div style={{fontSize: '0.8rem', color: theme.colors.textSecondary}}>🚆 {d.publicTransportScore ?? '—'}%</div>
                                                    <div style={{fontSize: '0.8rem', color: theme.colors.textSecondary}}>👥 {d.crowdIndex ?? '—'}</div>
                                                </div>
                                            </div>
                                            <Badge color="green">{(typeof d.avgScore === 'number' ? d.avgScore.toFixed(1) : '—')}/100</Badge>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center'}}>
                                            <div style={{fontSize: '0.85rem', color: theme.colors.textSecondary}}>{d.count} rec{d.count > 1 ? 's' : ''}</div>
                                            <button onClick={() => {
                                                if (!d.id) { showToast?.('Destination id missing', 'error'); return; }
                                                navigate(`/destination/${d.id}`);
                                            }} style={{background: theme.colors.primary, color: 'white', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, fontWeight: 700}}>
                                                Explore →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{padding: '1rem', color: theme.colors.textSecondary}}>{t('recommendations.empty_help') ?? 'No recommendations available yet.'}</div>
                        )}
                    </div>
                </MainCard>
            </ContentSection>
        </Container>
    );
}

