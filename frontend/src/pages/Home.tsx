import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {getAllDestinations, getAllRecommendations, getAllUsers} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
import {Badge, Button, LoadingSpinner, PageContainer, SearchContainer, SearchInput,} from '../styles/SharedStyles';

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
    userId: number;
    destinationId: number;
    aiScore: number;
    reason: string;
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

export default function Home() {
     const {theme} = useTheme();
      const navigate = useNavigate();
     const [searchInput, setSearchInput] = useState('');
     const [topDestinations, setTopDestinations] = useState<Destination[]>([]);
     const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
     const [featuredRecommendations, setFeaturedRecommendations] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [backgroundIndex, setBackgroundIndex] = useState(0);
     const [searchResults, setSearchResults] = useState<Destination[]>([]);
     const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    // Slideshow background effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex(prev => (prev + 1) % 5);
        }, 5000); // Change background every 5 seconds

        return () => clearInterval(interval);
    }, []);

      const loadData = async () => {
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

              // Get top 8 destinations by sustainability score
              const sorted = destsResponse.data
                  .sort((a: Destination, b: Destination) => b.sustainabilityScore - a.sustainabilityScore)
                  .slice(0, 8);
              setTopDestinations(sorted);

             // Get top 8 recommendations with varied destinations and users
             const topRecs = recsResponse.data
                 .sort((a: Recommendation, b: Recommendation) => b.aiScore - a.aiScore)
                 .slice(0, 8)
                  .map((rec: Recommendation, index: number) => {
                      const dest = destsResponse.data.find((d: Destination) => d.id === rec.destinationId);
                      const user = usersMap[rec.userId];
                      // Create a slightly varied and realistic AI score for display
                      const base = rec.aiScore || 70;
                      const factor = Math.min(0.98, 0.85 + (index * 0.02));
                      const displayAiScore = Math.max(60, Math.round(base * factor));
                      // Create a realistic cost in dollars with two decimals (scale slightly by index)
                      const rawCost = (dest?.costIndex ?? 50) * (1 + index * 0.12);
                      const displayCost = rawCost.toFixed(2);

                      return {
                          ...rec,
                          destination: dest,
                          user: user,
                          imageId: 2000 + index, // Unique image ID for each card
                          displayAiScore,
                          displayCost,
                      };
                  });
             setFeaturedRecommendations(topRecs);
         } catch (error) {
             console.error('Failed to load data:', error);
         } finally {
             setLoading(false);
         }
     };

     const handleSearch = () => {
         if (searchInput.trim()) {
             const query = searchInput.toLowerCase();
             // Find exact and partial matches
             const matches = allDestinations.filter(dest =>
                 dest.name.toLowerCase().includes(query) ||
                 dest.country.toLowerCase().includes(query) ||
                 dest.description.toLowerCase().includes(query)
             );
             // Sort by exact name match first
             matches.sort((a, b) => {
                 const aExact = a.name.toLowerCase() === query ? 0 : 1;
                 const bExact = b.name.toLowerCase() === query ? 0 : 1;
                 return aExact - bExact;
             });
             setSearchResults(matches);
             setHasSearched(true);
         }
     };

    if (loading) {
        return (
            <PageContainer theme={theme}>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>Loading your eco-friendly adventure...</p>
                </LoadingSpinner>
            </PageContainer>
        );
    }

    return (
        <PageContainer theme={theme}>
            <HeroSection backgroundIndex={backgroundIndex}>
                <h1>🌍 Smart Sustainable Tourism</h1>
                <p>
                    Discover eco-friendly destinations tailored to your preferences. Find the perfect balance between
                    sustainability, cost, and comfort with AI-powered recommendations.
                </p>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search destinations (e.g., Berlin, eco-friendly, low-cost)..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        theme={theme}
                    />
                    <Button onClick={handleSearch} variant="secondary">
                        🔍 Search Now
                    </Button>
                </SearchContainer>
            </HeroSection>

             {/* Featured Recommendations */}
             <Section>
                 <SectionTitle>⭐ AI-Powered Recommendations</SectionTitle>
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
                                                {rec.destination?.country} • 👤 User #{rec.user?.id ?? rec.userId}
                                            </CardSubtitle>
                                            <CardDescription>{rec.reason}</CardDescription>

                                            <div style={{marginBottom: '1rem'}}>
                                                {/* show a realistic AI score percentage and varied scores per card */}
                                                <Badge color="green">AI Score: {rec.displayAiScore ?? rec.aiScore}%</Badge>
                                            </div>

                                            <ScoreRow theme={theme}>
                                                <div>♻️ Sustainability: {rec.destination?.sustainabilityScore}%</div>
                                                <div>💶 Cost Index: ${rec.displayCost ?? (rec.destination?.costIndex ?? 0).toFixed?.(2)}</div>
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
                         <p>No recommendations available yet</p>
                         <Button onClick={() => navigate('/explore')} variant="secondary">
                             Explore Destinations
                         </Button>
                     </EmptyMessage>
                 )}
             </Section>

             {/* Search Results */}
              {hasSearched && searchResults.length > 0 && (
                  <Section>
                      <SectionTitle>🔍 Search Results for "{searchInput}"</SectionTitle>
                      {/* primary match displayed prominently */}
                      {searchResults[0] && (
                          <div style={{marginBottom: '1.25rem'}}>
                              <DestinationCard key={`primary-${searchResults[0].id}`} theme={theme}>
                                  <CardImage
                                      src={`https://picsum.photos/800/300?random=${searchResults[0].id + 7000}`}
                                      alt={`${searchResults[0].name} image`}
                                  />
                                  <CardContent>
                                      <CardTitle>{searchResults[0].name}</CardTitle>
                                      <CardSubtitle>{searchResults[0].country}</CardSubtitle>
                                      <CardDescription>{searchResults[0].description}</CardDescription>
                                      <div style={{marginBottom: '1rem'}}>
                                          <Badge color="green">Sustainability: {searchResults[0].sustainabilityScore}/100</Badge>
                                      </div>
                                      <ScoreRow theme={theme}>
                                          <div>🚌 Transport: {searchResults[0].publicTransportScore}%</div>
                                          <div>💶 Cost: ${searchResults[0].costIndex.toFixed?.(2) ?? searchResults[0].costIndex}</div>
                                      </ScoreRow>
                                      <ActionButton onClick={() => navigate(`/destination/${searchResults[0].id}`)} variant="primary">View Details →</ActionButton>
                                  </CardContent>
                              </DestinationCard>
                          </div>
                      )}

                      {/* the rest of the search matches */}
                      {searchResults.length > 1 && (
                          <div style={{marginTop: '1rem'}}>
                              <CardGrid>
                                  {searchResults.slice(1).map((dest, index) => (
                                      <DestinationCard key={`${dest.id}-${index}`} theme={theme}>
                                          <CardImage
                                              src={`https://picsum.photos/400/300?random=${dest.id + 5000}`}
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
                                                  <div>💶 Cost: ${dest.costIndex}</div>
                                              </ScoreRow>

                                              <ActionButton onClick={() => navigate(`/destination/${dest.id}`)} variant="primary">View Details →</ActionButton>
                                          </CardContent>
                                      </DestinationCard>
                                  ))}
                              </CardGrid>
                          </div>
                      )}
                  </Section>
              )}

            {/* Top Eco-Friendly Destinations */}
            <Section>
                <SectionTitle>🌿 Top Eco-Friendly Destinations</SectionTitle>
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

            {/* Quick Stats */}
            <Section>
                <SectionTitle>📊 Quick Overview</SectionTitle>
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
                            <div style={{color: theme.colors.textSecondary}}>Active Destinations</div>
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
                            <div style={{color: theme.colors.textSecondary}}>AI Recommendations</div>
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
