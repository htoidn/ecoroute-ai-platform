import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {getAllRecommendations, getDestinationById, getUserById} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
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
    reason: string;
}

interface User {
    id: number;
    username: string;
    email: string;
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
    height: 350px;
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
    font-size: 3rem;
    font-weight: 800;
    color: white;
    margin: 0;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const HeroSubtitle = styled.p`
    font-size: 1.1rem;
    color: #e0e7ff;
    margin: 0.5rem 0 0 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        font-size: 0.9rem;
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

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }
`;

const RecommendationBox = styled.div`
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border-left: 4px solid #3b82f6;

    h3 {
        color: #0f172a;
        margin-top: 0;
        font-size: 1.3rem;
    }

    p {
        color: #1e293b;
        line-height: 1.6;
        margin: 0.75rem 0;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
        h3 {
            font-size: 1rem;
        }
    }
`;

const UserProfileCard = styled.div`
    background: linear-gradient(135deg, #f3e8ff, #ede9fe);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border-left: 4px solid #a855f7;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const UserProfileTitle = styled.h3`
    color: #481a6b;
    margin-top: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const UserInfo = styled.div`
    color: #3730a3;
    font-weight: 500;
    margin: 0.5rem 0;
`;

const InsightsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const InsightCard = styled.div`
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    padding: 1.5rem;
    border-radius: 12px;
    border: 2px solid ${props => props.color || '#48bb78'};

    .label {
        font-size: 0.85rem;
        font-weight: 600;
        color: ${props => props.theme?.colors?.textSecondary || '#718096'};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.75rem;
    }

    .value {
        font-size: 1.8rem;
        font-weight: 800;
        color: ${props => props.color || '#48bb78'};
    }

    .description {
        font-size: 0.9rem;
        color: ${props => props.theme?.colors?.textSecondary || '#718096'};
        margin-top: 0.75rem;
    }
`;

const HighlightsSection = styled.div`
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    padding: 2rem;
    border-radius: 12px;
    border: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    margin-top: 2rem;
`;

const HighlightsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        padding: 0.75rem 0;
        padding-left: 2rem;
        position: relative;
        color: ${props => props.theme?.colors?.text || '#1a202c'};
        line-height: 1.6;

        &::before {
            content: '✨';
            position: absolute;
            left: 0;
        }
    }
`;

const ScoreRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
`;

const ScoreItem = styled.div`
    padding: 1rem;
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    border-radius: 8px;
    text-align: center;

    .label {
        font-size: 0.85rem;
        color: ${props => props.theme?.colors?.textSecondary || '#718096'};
        margin-bottom: 0.5rem;
    }

    .value {
        font-size: 1.5rem;
        font-weight: 800;
        color: ${props => props.theme?.colors?.primary || '#48bb78'};
    }
`;

const DestinationDescription = styled.p`
    font-size: 1.1rem;
    line-height: 1.8;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    margin-bottom: 1.5rem;
    margin-top: 1rem;
`;

export default function RecommendationDetail() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {theme} = useTheme();
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                if (id) {
                    const allRecsResponse = await getAllRecommendations();
                    const rec = allRecsResponse.data.find((r: Recommendation) => r.id === parseInt(id));

                    if (rec && mounted) {
                        setRecommendation(rec);
                        const [destResponse, userResponse] = await Promise.all([
                            getDestinationById(rec.destinationId),
                            getUserById(rec.userId),
                        ]);
                        if (mounted) {
                            setDestination(destResponse.data);
                            setUser(userResponse.data);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load recommendation details:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id]);


    if (loading) {
        return (
            <Container theme={theme}>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>Loading recommendation details...</p>
                </LoadingSpinner>
            </Container>
        );
    }

    if (!recommendation || !destination || !user) {
        return (
            <Container theme={theme}>
                <BackButton onClick={() => navigate(-1)}>← Go Back</BackButton>
                <EmptyState style={{marginTop: '100px'}}>
                    <div className="icon">⭐</div>
                    <h3>Recommendation not found</h3>
                    <p>Sorry, we couldn't find the recommendation you're looking for.</p>
                </EmptyState>
            </Container>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#48bb78';
        if (score >= 75) return '#f6ad55';
        return '#fc8181';
    };

    const getRecommendationInsights = () => {
        const insights = [];

        if (destination.sustainabilityScore >= 80) {
            insights.push(`${destination.name} is an exceptionally eco-conscious choice with a sustainability score of ${destination.sustainabilityScore}%`);
        }

        if (destination.costIndex < 60) {
            insights.push(`It's also budget-friendly at $${destination.costIndex}/day, perfect for sustainable tourism on a budget`);
        }

        if (destination.publicTransportScore >= 80) {
            insights.push(`The excellent public transportation infrastructure (${destination.publicTransportScore}%) minimizes the need for private vehicles`);
        }

        if (destination.crowdIndex < 50) {
            insights.push(`With a low crowd index of ${destination.crowdIndex}, you'll enjoy peaceful and authentic experiences`);
        }

        if (destination.co2PerTrip <= 100) {
            insights.push(`The carbon footprint is minimal at ${destination.co2PerTrip}kg CO₂, one of the most eco-friendly options`);
        }

        return insights;
    };

    const insights = getRecommendationInsights();

    return (
        <Container theme={theme}>
            <BackButton onClick={() => navigate(-1)}>← Go Back</BackButton>

            <HeroSection $imageId={destination.id + 1000}>
                <HeroOverlay>
                    <HeroTitle>⭐ {destination.name}</HeroTitle>
                    <HeroSubtitle>🌍 {destination.country}</HeroSubtitle>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <MainCard theme={theme}>
                    {/* AI Recommendation Reason */}
                    <RecommendationBox>
                        <h3>💡 AI Recommendation</h3>
                        <p>{recommendation.reason}</p>
                        <div style={{marginTop: '1rem'}}>
                            <Badge color="blue">AI Score: {recommendation.aiScore}/100</Badge>
                        </div>
                    </RecommendationBox>

                    {/* User Profile */}
                    <UserProfileCard>
                        <UserProfileTitle>👤 Recommended by {user.username}</UserProfileTitle>
                        <UserInfo>Email: {user.email}</UserInfo>
                    </UserProfileCard>

                    {/* Key Metrics */}
                    <SectionTitle>📊 Key Metrics</SectionTitle>
                    <InsightsGrid>
                        <InsightCard color={getScoreColor(destination.sustainabilityScore)} theme={theme}>
                            <div className="label">♻️ Sustainability</div>
                            <div className="value">{destination.sustainabilityScore}%</div>
                            <div className="description">
                                {destination.sustainabilityScore >= 90 ? 'Exceptional eco-friendly practices' :
                                    destination.sustainabilityScore >= 70 ? 'Strong environmental commitment' :
                                        'Moderate sustainability measures'}
                            </div>
                        </InsightCard>

                        <InsightCard color="#3b82f6" theme={theme}>
                            <div className="label">💶 Cost Index</div>
                            <div className="value">${destination.costIndex}</div>
                            <div className="description">
                                Average daily budget
                                {destination.costIndex < 60 ? ' - Budget-friendly' :
                                    destination.costIndex < 80 ? ' - Moderate' : ' - Premium'}
                            </div>
                        </InsightCard>

                        <InsightCard color="#8b5cf6" theme={theme}>
                            <div className="label">🚆 Public Transport</div>
                            <div className="value">{destination.publicTransportScore}%</div>
                            <div className="description">
                                {destination.publicTransportScore >= 80 ? 'Excellent infrastructure' :
                                    destination.publicTransportScore >= 60 ? 'Good connectivity' :
                                        'Limited options'}
                            </div>
                        </InsightCard>

                        <InsightCard color="#ec4899" theme={theme}>
                            <div className="label">👥 Crowd Level</div>
                            <div className="value">{100 - destination.crowdIndex}%</div>
                            <div className="description">
                                Quietness score
                                {(100 - destination.crowdIndex) >= 75 ? ' - Very peaceful' :
                                    (100 - destination.crowdIndex) >= 50 ? ' - Moderately quiet' : ' - Popular'}
                            </div>
                        </InsightCard>

                        <InsightCard color="#06b6d4" theme={theme}>
                            <div className="label">🌍 CO₂ per Trip</div>
                            <div className="value">{destination.co2PerTrip}</div>
                            <div className="description">kg CO₂ emissions</div>
                        </InsightCard>

                        <InsightCard color="#f59e0b" theme={theme}>
                            <div className="label">🌡️ Temperature</div>
                            <div className="value">{destination.avgTemp}°C</div>
                            <div className="description">
                                Best in {destination.bestSeason}
                            </div>
                        </InsightCard>
                    </InsightsGrid>

                    {/* Destination Description */}
                    <SectionTitle style={{marginTop: '2rem'}}>🗺️ About the Destination</SectionTitle>
                    <DestinationDescription>{destination.description}</DestinationDescription>

                    {/* Why This Recommendation */}
                    <HighlightsSection>
                        <SectionTitle style={{marginBottom: '1rem'}}>✨ Why We Recommend This</SectionTitle>
                        <HighlightsList>
                            {insights.map((insight, index) => (
                                <li key={index}>{insight}</li>
                            ))}
                        </HighlightsList>
                    </HighlightsSection>

                    {/* Additional Info */}
                    <SectionTitle style={{marginTop: '2rem'}}>ℹ️ Additional Information</SectionTitle>
                    <ScoreRow>
                        <ScoreItem theme={theme}>
                            <div className="label">Season</div>
                            <div className="value">{destination.bestSeason}</div>
                        </ScoreItem>
                        <ScoreItem theme={theme}>
                            <div className="label">Latitude</div>
                            <div className="value">{destination.latitude?.toFixed(2) || 'N/A'}°</div>
                        </ScoreItem>
                        <ScoreItem theme={theme}>
                            <div className="label">Longitude</div>
                            <div className="value">{destination.longitude?.toFixed(2) || 'N/A'}°</div>
                        </ScoreItem>
                    </ScoreRow>
                </MainCard>
            </ContentSection>
        </Container>
    );
}

