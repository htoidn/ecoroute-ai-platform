import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {getAllDestinations, searchDestinations} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
import {
    Button,
    CardGrid,
    EmptyState,
    LoadingSpinner,
    PageContainer,
    PageHeader,
    PageSubtitle,
    PageTitle,
    SearchContainer,
    SearchInput,
} from '../styles/SharedStyles';
import RouteCard from '../components/RouteCard';
import EcoScoreCard from '../components/EcoScoreCard';
import WeatherCard from '../components/WeatherCard';
import { useLocalization } from '../contexts/LocalizationContext';

interface Destination {
    id: number;
    name: string;
    country: string;
    sustainabilityScore: number;
    costIndex: number;
    crowdIndex: number;
    publicTransportScore: number;
    avgTemp: number;
    bestSeason: string;
    tags: string;
    description: string;
    co2PerTrip?: number;
}

const DestinationCard = styled.div`
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 25px rgba(72, 187, 120, 0.2);
    }
`;

const ImageSlideshow = styled.div`
    width: 100%;
    height: 250px;
    position: relative;
    overflow: hidden;
    border-radius: 16px 16px 0 0;

    @media (max-width: 768px) {
        height: 200px;
    }
`;

const Slide = styled.img<{ active: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.5s ease-in-out;
`;

const CardContent = styled.div`
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const CardTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    margin-bottom: 0.5rem;
    line-height: 1.3;
`;

const CardSubtitle = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    margin-bottom: 1rem;
`;

const Description = styled.p`
    font-size: 0.95rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    margin-bottom: 1.2rem;
    line-height: 1.5;
    flex: 1;
`;

const ScoresContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.2rem;
`;

const ScoreItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const ScoreLabel = styled.span`
    font-size: 0.8rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    font-weight: 600;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const ScoreBar = styled.div`
    height: 6px;
    background: ${props => props.theme?.colors?.border || '#e2e8f0'};
    border-radius: 3px;
    overflow: hidden;
`;

const ScoreFill = styled.div<{ value: number; color: string }>`
    height: 100%;
    width: ${props => props.value}%;
    background: ${props => props.color};
    transition: width 0.3s ease;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
`;

const Tag = styled.span`
    display: inline-block;
    padding: 0.35rem 0.75rem;
    background: ${props => props.theme?.colors?.border || '#e2e8f0'};
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
`;

const ViewDetailsButton = styled.button`
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
    }
`;


export default function Explore() {
    const {theme} = useTheme();
    const { t } = useLocalization();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [slideIndex, setSlideIndex] = useState(0);


    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await getAllDestinations();
                if (!mounted) return;
                setDestinations(response.data);

                // Apply search filter if search param exists
                const searchQuery = searchParams.get('search');
                if (searchQuery) {
                    setSearchQuery(searchQuery);
                    const filtered = response.data.filter(
                        (dest: Destination) =>
                            dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dest.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setFilteredDestinations(filtered);
                } else {
                    setFilteredDestinations(response.data);
                }
            } catch (error) {
                console.error('Failed to load destinations:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        const interval = setInterval(() => {
            setSlideIndex(prev => (prev + 1) % 3);
        }, 3000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [searchParams]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredDestinations(destinations);
            return;
        }

        setLoading(true);
        try {
            const response = await searchDestinations(query);
            setFilteredDestinations(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            // Fallback to local filtering
            const filtered = destinations.filter(
                dest =>
                    dest.name.toLowerCase().includes(query.toLowerCase()) ||
                    dest.country.toLowerCase().includes(query.toLowerCase()) ||
                    dest.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredDestinations(filtered);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return '#48bb78';
        if (score >= 70) return '#f6ad55';
        return '#fc8181';
    };

    return (
        <PageContainer theme={theme}>
            <PageHeader>
                <PageTitle>{t('explore.title')}</PageTitle>
                <PageSubtitle>{t('explore.subtitle')}</PageSubtitle>
            </PageHeader>

            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder={t('explore.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    theme={theme}
                />
                <Button onClick={() => handleSearch(searchQuery)} variant="secondary">
                    🔍 Search
                </Button>
            </SearchContainer>

            {/* Route Calculator */}
            <div style={{margin: '2rem 0', padding: '2rem 0', borderRadius: '16px'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.colors.text}}>
                    {t('explore.plan_route')}
                </h2>
                <RouteCard startLat={51.5074} startLon={-0.1278} endLat={48.8566} endLon={2.3522}/>
            </div>

            {/* Eco Score Calculator */}
            <div style={{margin: '2rem 0', padding: '2rem 0', borderRadius: '16px'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.colors.text}}>
                    ♻️ Carbon Footprint Analyzer
                </h2>
                <CardGrid style={{gridTemplateColumns: '1fr'}}>
                    <EcoScoreCard initialDistance={100} initialTransport="car"/>
                </CardGrid>
            </div>

            {/* Weather Information */}
            <div style={{margin: '2rem 0', padding: '2rem 0', borderRadius: '16px'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: theme.colors.text}}>
                    🌤️ Destination Weather
                </h2>
                <CardGrid style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
                    <WeatherCard city="Berlin"/>
                    <WeatherCard city="Frankfurt"/>
                    <WeatherCard city="Munich"/>
                </CardGrid>
            </div>

            {loading ? (
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>{t('explore.loading')}</p>
                </LoadingSpinner>
            ) : filteredDestinations.length === 0 ? (
                <EmptyState>
                    <div className="icon">🌐</div>
                    <h3>{t('explore.no_destinations')}</h3>
                    <p>{t('explore.no_results_help') ?? 'Try adjusting your search or explore our featured destinations.'}</p>
                </EmptyState>
            ) : (
                <>
                    <p style={{color: theme.colors.textSecondary, marginBottom: '1.5rem'}}>
                        {t('explore.found_destinations', { count: filteredDestinations.length })}
                    </p>
                    <CardGrid>
                        {filteredDestinations.map((destination, idx) => (
                            <DestinationCard key={destination.id ?? idx} theme={theme}>
                                <ImageSlideshow>
                                    <Slide src={`https://picsum.photos/400/300?random=${destination.id}1`}
                                           active={slideIndex === 0}/>
                                    <Slide src={`https://picsum.photos/400/300?random=${destination.id}2`}
                                           active={slideIndex === 1}/>
                                    <Slide src={`https://picsum.photos/400/300?random=${destination.id}3`}
                                           active={slideIndex === 2}/>
                                </ImageSlideshow>

                                <CardContent>
                                    <CardTitle>{destination.name}</CardTitle>
                                    <CardSubtitle>{destination.country}</CardSubtitle>

                                    <Description>{destination.description}</Description>

                                    <ScoresContainer>
                                        <ScoreItem>
                                            <ScoreLabel>Sustainability</ScoreLabel>
                                            <ScoreBar>
                                                <ScoreFill
                                                    value={destination.sustainabilityScore}
                                                    color={getScoreColor(destination.sustainabilityScore)}
                                                />
                                            </ScoreBar>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: theme.colors.textSecondary,
                                                marginTop: '0.2rem'
                                            }}>
                                                {destination.sustainabilityScore.toFixed(1)}/100
                                            </div>
                                        </ScoreItem>

                                        <ScoreItem>
                                            <ScoreLabel>Public Transport</ScoreLabel>
                                            <ScoreBar>
                                                <ScoreFill
                                                    value={destination.publicTransportScore}
                                                    color={getScoreColor(destination.publicTransportScore)}
                                                />
                                            </ScoreBar>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: theme.colors.textSecondary,
                                                marginTop: '0.2rem'
                                            }}>
                                                {destination.publicTransportScore.toFixed(1)}/100
                                            </div>
                                        </ScoreItem>
                                    </ScoresContainer>

                                     <TagsContainer>
                                         {destination.tags?.split(',').slice(0, 3).map((tag, idx) => (
                                             <Tag key={idx} theme={theme}>{tag.trim()}</Tag>
                                         ))}
                                     </TagsContainer>

                                     <div style={{
                                         display: 'grid',
                                         gridTemplateColumns: '1fr 1fr',
                                         gap: '0.5rem',
                                         fontSize: '0.85rem',
                                         color: theme.colors.textSecondary,
                                         marginBottom: '1rem'
                                     }}>
                                         <div>💶 Cost Index: ${destination.costIndex.toFixed(2)}</div>
                                         <div>👥 Crowd: {destination.crowdIndex.toFixed(0)}</div>
                                         <div>🌡️ Avg Temp: {destination.avgTemp}°C</div>
                                         <div>🍂 Best: {destination.bestSeason}</div>
                                     </div>

                                     <ViewDetailsButton onClick={() => navigate(`/destination/${destination.id}`)}>
                                         🔍 View Details →
                                     </ViewDetailsButton>
                                </CardContent>
                            </DestinationCard>
                        ))}
                    </CardGrid>
                </>
            )}
        </PageContainer>
    );
}
