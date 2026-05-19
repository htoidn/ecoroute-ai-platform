import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {getAllDestinations, getAllRecommendations, getAllUsers} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
import {Badge, Button, LoadingSpinner, PageContainer, SearchContainer, SearchInput,} from '../styles/SharedStyles';
import WeatherCard from '../components/WeatherCard';
import EcoScoreCard from '../components/EcoScoreCard';
import RouteCard from '../components/RouteCard';
import { useLocalization } from '../contexts/LocalizationContext';

interface Destination {
    id: number;
    name: string;
    country: string;
    sustainabilityScore: number;
    costIndex: number;
    crowdIndex: number;
    publicTransportScore: number;
    description: string;
    tags: string;
    bestSeason: string;
}

interface Recommendation {
    id: number;
    userId?: number;
    destinationId?: number;
    aiScore: number;
    reason: string;
    user?: { id: number; username?: string };
    destination?: { id: number; name: string; country: string };
}

const HeroSection = styled.div<{ backgroundIndex: number }>`
    text-align: center;
    padding: 4rem 2rem;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, rgba(72, 187, 120, 0.8), rgba(56, 161, 105, 0.8));
    background-image: linear-gradient(135deg, rgba(72, 187, 120, 0.8), rgba(56, 161, 105, 0.8)),
    url('https://picsum.photos/1920/1080?random=${props => props.backgroundIndex + 1001}');
    background-size: cover;
    background-position: center;
    border-radius: 20px;
    color: white;
    position: relative;
    overflow: hidden;
    transition: background-image 0.8s ease-in-out;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        border-radius: 50%;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -30%;
        left: -30%;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
        border-radius: 50%;
    }

    h1 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
        line-height: 1.2;
        position: relative;
        z-index: 1;

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.95;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        z-index: 1;

        @media (max-width: 768px) {
            font-size: 1rem;
        }
    }
`;

const Section = styled.div`
    margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #48bb78, #38a169);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const DestinationCard = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.cardBg};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 15px ${props => props.theme.colors.shadow};
    transition: all 0.3s ease;
    border: 1px solid ${props => props.theme.colors.border};
    cursor: pointer;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 25px rgba(72, 187, 120, 0.2);
    }
`;

const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
`;

const CardContent = styled.div`
    padding: 1.5rem;
`;

const CardTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1rem;
`;

const CardDescription = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 1rem;
    line-height: 1.5;
    min-height: 50px;
`;

const ScoreRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textSecondary};
`;

const ActionButton = styled(Button)`
    width: 100%;
`;


const EmptyMessage = styled.div`
    text-align: center;
    padding: 3rem 2rem;
    color: ${props => props.theme.colors.textSecondary};

    .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
`;

const SearchResultsSection = styled.div`
    margin-bottom: 3rem;
    padding: 2rem;
    background: ${props => props.theme.colors.bgSecondary};
    border-radius: 16px;
    border: 2px solid ${props => props.theme.colors.primary};
`;

const SearchResultsTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: space-between;
`;

const ClearButton = styled.button`
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }
`;

export default function Home() {
    const {theme} = useTheme();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
    const [topDestinations, setTopDestinations] = useState<Destination[]>([]);
    const [featuredRecommendations, setFeaturedRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [searchResults, setSearchResults] = useState<Destination[]>([]);
    const [hasSearched, setHasSearched] = useState(false);



    // Slideshow background effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex(prev => (prev + 1) % 5);
        }, 5000); // Change background every 5 seconds

        return () => clearInterval(interval);
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [destsResponse, recsResponse, usersResponse] = await Promise.all([
                getAllDestinations(),
                getAllRecommendations(),
                getAllUsers(),
            ]);

            // Store all destinations for search
            setAllDestinations(destsResponse.data);

            // Create users map
            const usersMap: { [key: number]: any } = {};
            usersResponse.data.forEach((user: any) => {
                usersMap[user.id] = user;
            });

            // Get top 8 destinations by sustainability score, deduplicated by name.
            // For duplicated names we pick the entry with the highest sustainabilityScore.
            const bestByName = new Map<string, Destination>();
            destsResponse.data.forEach((dest: Destination) => {
                const existing = bestByName.get(dest.name);
                if (!existing || (dest.sustainabilityScore ?? 0) > (existing.sustainabilityScore ?? 0)) {
                    bestByName.set(dest.name, dest);
                }
            });

            const sorted = Array.from(bestByName.values())
                .sort((a: Destination, b: Destination) => (b.sustainabilityScore ?? 0) - (a.sustainabilityScore ?? 0))
                .slice(0, 8);
            setTopDestinations(sorted);

            // Get top 8 recommendations but ensure different destination ids (avoid duplicates caused by multiple recs for same city)
            const seenDestIds = new Set<number>();
            const sortedRecs = recsResponse.data
                .sort((a: Recommendation, b: Recommendation) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

            const topRecsArr: any[] = [];
            for (let i = 0; i < sortedRecs.length && topRecsArr.length < 8; i++) {
                const rec = sortedRecs[i];
                const destId = rec.destination?.id ?? rec.destinationId;
                if (!destId) continue;
                if (seenDestIds.has(destId)) continue;
                seenDestIds.add(destId);

                const dest = rec.destination || destsResponse.data.find((d: Destination) => d.id === destId);
                const userId = rec.user?.id ?? rec.userId;
                const user = userId ? (rec.user || usersMap[userId]) : null;

                const index = topRecsArr.length;
                const base = rec.aiScore || 70;
                const factor = Math.min(0.98, 0.85 + (index * 0.02));
                const displayAiScore = Math.max(60, Math.round(base * factor));
                const rawCost = (dest?.costIndex ?? 50) * (1 + index * 0.12);
                const displayCost = rawCost.toFixed(2);

                topRecsArr.push({
                    ...rec,
                    destination: dest,
                    user,
                    imageId: 2000 + index,
                    displayAiScore,
                    displayCost,
                });
            }

            setFeaturedRecommendations(topRecsArr);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = () => {
        if (searchInput.trim()) {
            const query = searchInput.toLowerCase().trim();

            let matches = allDestinations.filter(dest => {
                const destName = dest.name.toLowerCase();
                const destCountry = dest.country.toLowerCase();
                const destDesc = dest.description.toLowerCase();
                const tags = (dest.tags || '').toLowerCase();

                // Check for attribute-based searches
                if (query.includes('eco-friendly') || query.includes('ecofriendly') || query === 'eco') {
                    return (dest.sustainabilityScore ?? 0) >= 70;
                }
                if (query.includes('low-cost') || query.includes('lowcost') || query === 'cheap') {
                    return (dest.costIndex ?? 0) <= 50;
                }
                if (query.includes('high-cost') || query.includes('highcost') || query === 'expensive') {
                    return (dest.costIndex ?? 0) >= 75;
                }
                if (query.includes('crowded') || query === 'busy') {
                    return (dest.crowdIndex ?? 0) >= 70;
                }
                if (query.includes('quiet') || query === 'peaceful') {
                    return (dest.crowdIndex ?? 0) <= 40;
                }
                if (query.includes('beach') || query === 'sea') {
                    return tags.includes('beach') || destDesc.includes('beach');
                }
                if (query.includes('mountain') || query === 'hiking') {
                    return tags.includes('mountain') || destDesc.includes('mountain');
                }
                if (query.includes('urban') || query === 'city') {
                    return tags.includes('urban') || destDesc.includes('urban');
                }

                // Default text search
                return destName.includes(query) || destCountry.includes(query) || destDesc.includes(query) || tags.includes(query);
            });

            // Sort: exact name match first, then others
            matches.sort((a, b) => {
                const aExact = a.name.toLowerCase() === query ? 0 : 1;
                const bExact = b.name.toLowerCase() === query ? 0 : 1;
                return aExact - bExact;
            });

            setSearchResults(matches);
            setHasSearched(true);
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setHasSearched(false);
        setSearchResults([]);
    };

    const { t } = useLocalization();

    if (loading) {
        return (
            <PageContainer theme={theme}>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>{t('home.loading',) || 'Loading your eco-friendly adventure...'}</p>
                </LoadingSpinner>
            </PageContainer>
        );
    }

    return (
        <PageContainer theme={theme}>
            <HeroSection backgroundIndex={backgroundIndex}>
                <h1>{t('home.title')}</h1>
                <p>{t('home.subtitle')}</p>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder={t('home.search_placeholder')}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        theme={theme}
                    />
                    <Button onClick={handleSearch} variant="secondary">
                        {t('home.search_button')}
                    </Button>
                </SearchContainer>
            </HeroSection>

            {/* Search Results */}
            {hasSearched && (
                <SearchResultsSection theme={theme}>
                    <SearchResultsTitle theme={theme}>
                        {t('search.results_for', { query: searchInput }) ?? `🔍 Search Results for "${searchInput}"`}
                        <ClearButton theme={theme} onClick={handleClearSearch}>
                            {t('home.clear') ?? 'Clear'}
                        </ClearButton>
                    </SearchResultsTitle>
                    {searchResults.length > 0 ? (
                        <CardGrid>
                            {searchResults.map((dest, index) => (
                                <DestinationCard key={dest.id} theme={theme}>
                                    <CardImage
                                        src={`https://picsum.photos/400/300?random=${dest.id + 500}`}
                                        alt={`${dest.name} image`}
                                    />
                                    <CardContent>
                                        <CardTitle>{dest.name}</CardTitle>
                                        <CardSubtitle>{dest.country}</CardSubtitle>
                                        <CardDescription>{dest.description}</CardDescription>

                                        <div style={{marginBottom: '1rem'}}>
                                            <Badge color="green">
                                                {index === 0 && searchResults.length > 0 && searchResults[0].name === dest.name ? '✓ Perfect Match!' : 'Match'}
                                            </Badge>
                                        </div>

                                        <ScoreRow theme={theme}>
                                            <div>🌍 Sustainability: {dest.sustainabilityScore}%</div>
                                            <div>💶 Cost: ${dest.costIndex}</div>
                                        </ScoreRow>
                                    </CardContent>
                                </DestinationCard>
                            ))}
                        </CardGrid>
                    ) : (
                            <EmptyMessage theme={theme}>
                            <div className="icon">🔍</div>
                            <p>{t('home.no_match') ?? 'No destinations match your search'}</p>
                        </EmptyMessage>
                    )}
                </SearchResultsSection>
            )}
            <Section>
                <SectionTitle>{t('recommendations.title')}</SectionTitle>
                {featuredRecommendations.length > 0 ? (
                    <CardGrid>
                        {featuredRecommendations.map((rec) => (
                            <DestinationCard key={rec.id} theme={theme}>
                                <CardImage
                                    src={`https://picsum.photos/400/300?random=${rec.imageId}`}
                                    alt={`${rec.destination?.name} image`}
                                />
                                <CardContent>
                                    <CardTitle>{rec.destination?.name}</CardTitle>
                                    <CardSubtitle>
                                        {rec.destination?.country} • 👤 User #{rec.user?.id ?? rec.userId ?? 'N/A'}
                                    </CardSubtitle>
                                    <CardDescription>{rec.reason}</CardDescription>

                                    <div style={{marginBottom: '1rem'}}>
                                        {/* show a realistic AI score percentage and varied scores per card */}
                                        <Badge color="green">AI Score: {rec.displayAiScore ?? rec.aiScore}%</Badge>
                                    </div>

                                    <ScoreRow theme={theme}>
                                        <div>♻️ Sustainability: {rec.destination?.sustainabilityScore}%</div>
                                        <div>💶 Cost Index:
                                            ${rec.displayCost ?? (rec.destination?.costIndex ?? 0).toFixed?.(2)}</div>
                                    </ScoreRow>

                                    <ActionButton onClick={() => navigate('/recommendations')}
                                                  variant="primary">
                                        View Details →
                                    </ActionButton>
                                </CardContent>
                            </DestinationCard>
                        ))}
                    </CardGrid>
                    ) : (
                    <EmptyMessage theme={theme}>
                        <div className="icon">🤖</div>
                        <p>{t('home.no_recommendations')}</p>
                        <Button onClick={() => navigate('/explore')} variant="secondary">
                            {t('home.explore_button')}
                        </Button>
                    </EmptyMessage>
                )}
            </Section>

            {/* Top Eco-Friendly Destinations */}
            <Section>
                <SectionTitle>{t('home.top_destinations_title')}</SectionTitle>
                {topDestinations.length > 0 ? (
                    <CardGrid>
                        {topDestinations.map(dest => (
                            <DestinationCard key={dest.id} theme={theme}>
                                <CardImage
                                    src={`https://picsum.photos/400/300?random=${dest.id}`}
                                    alt={`${dest.name} image`}
                                />
                                <CardContent>
                                    <CardTitle>{dest.name}</CardTitle>
                                    <CardSubtitle>{dest.country}</CardSubtitle>
                                    <CardDescription>{dest.description}</CardDescription>

                                    <div style={{marginBottom: '1rem'}}>
                                        <Badge color="green">Sustainability: {dest.sustainabilityScore}/100</Badge>
                                    </div>

                                    <ScoreRow theme={theme}>
                                        <div>🚌 Transport: {dest.publicTransportScore}%</div>
                                        <div>👥 Crowd Index: {dest.crowdIndex}</div>
                                        <div>🍂 Best: {dest.bestSeason}</div>
                                        <div>💶 Cost: {dest.costIndex}</div>
                                    </ScoreRow>

                                    <ActionButton onClick={() => navigate('/explore')} variant="primary">
                                        Explore More →
                                    </ActionButton>
                                </CardContent>
                            </DestinationCard>
                        ))}
                    </CardGrid>
                ) : (
                    <EmptyMessage theme={theme}>
                        <div className="icon">🌍</div>
                        <p>No destinations available yet</p>
                    </EmptyMessage>
                )}
            </Section>

            {/* Weather Information */}
            <Section>
                <SectionTitle>{t('home.weather_title')}</SectionTitle>
                <CardGrid style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
                    <WeatherCard city="Berlin"/>
                    <WeatherCard city="Frankfurt"/>
                    <WeatherCard city="Munich"/>
                </CardGrid>
            </Section>

            {/* Eco Score Calculator */}
            <Section>
                <SectionTitle>♻️ Carbon Footprint Analyzer</SectionTitle>
                <CardGrid style={{gridTemplateColumns: '1fr'}}>
                    <EcoScoreCard initialDistance={100} initialTransport="car"/>
                </CardGrid>
            </Section>

            {/* Route Calculator */}
            <Section>
                <SectionTitle>🗺️ Eco-Route Planner</SectionTitle>
                <CardGrid style={{gridTemplateColumns: '1fr'}}>
                    <RouteCard
                        startLat={51.5074}
                        startLon={-0.1278}
                        endLat={48.8566}
                        endLon={2.3522}
                    />
                </CardGrid>
            </Section>

            {/* Quick Stats */}
            <Section>
                <SectionTitle>{t('home.quick_overview_title')}</SectionTitle>
                <CardGrid>
                    <DestinationCard theme={theme}>
                        <CardContent style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: theme.colors.primary,
                                marginBottom: '0.5rem'
                            }}>
                                {topDestinations.length}
                            </div>
                            <div style={{color: theme.colors.textSecondary}}>{t('home.active_destinations') ?? 'Active Destinations'}</div>
                        </CardContent>
                    </DestinationCard>
                    <DestinationCard theme={theme}>
                        <CardContent style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: theme.colors.primary,
                                marginBottom: '0.5rem'
                            }}>
                                {featuredRecommendations.length}
                            </div>
                            <div style={{color: theme.colors.textSecondary}}>{t('home.ai_recommendations_label') ?? 'AI Recommendations'}</div>
                        </CardContent>
                    </DestinationCard>
                    <DestinationCard theme={theme}>
                        <CardContent style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: theme.colors.primary,
                                marginBottom: '0.5rem'
                            }}>
                                ♻️
                            </div>
                            <div style={{color: theme.colors.textSecondary}}>100% Eco-Conscious</div>
                        </CardContent>
                    </DestinationCard>
                </CardGrid>
            </Section>
        </PageContainer>
    );
}
