import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {getAllDestinations, getAllRecommendations} from '../services/api';
import {useTheme} from '../contexts/ThemeContext';
import {useNotification} from '../contexts/NotificationContext';
import {
    Badge,
    EmptyState,
    LoadingSpinner,
    PageContainer,
    PageHeader,
    PageSubtitle,
    PageTitle,
} from '../styles/SharedStyles';

interface Recommendation {
    id: number;
    userId: number;
    destinationId: number;
    aiScore: number;
    reason: string;
    createdAt?: string;
}

interface Destination {
    id: number;
    name: string;
    country: string;
    sustainabilityScore: number;
    costIndex?: number;
    crowdIndex?: number;
    publicTransportScore?: number;
    description?: string;
}

const TabContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    overflow-x: auto;

    @media (max-width: 768px) {
        gap: 0.5rem;
    }
`;

const Tab = styled.button<{ active: boolean }>`
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.active
            ? props.theme?.colors?.primary || '#48bb78'
            : props.theme?.colors?.textSecondary || '#718096'};
    border-bottom: 3px solid ${props => props.active
            ? props.theme?.colors?.primary || '#48bb78'
            : 'transparent'};
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
        color: ${props => props.theme?.colors?.primary || '#48bb78'};
    }

    @media (max-width: 768px) {
        padding: 0.75rem 1rem;
        font-size: 0.85rem;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};

    @media (max-width: 768px) {
        display: block;
        font-size: 0.9rem;
    }
`;

const TableHead = styled.thead`
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    border-bottom: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
`;

const TableRow = styled.tr`
    border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    transition: background-color 0.2s ease;

    &:hover {
        background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    }

    @media (max-width: 768px) {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    }
`;

const TableHeader = styled.th`
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const TableCell = styled.td`
    padding: 1rem 1.5rem;
    color: ${props => props.theme?.colors?.text || '#1a202c'};

    @media (max-width: 768px) {
        padding: 0.75rem;
        display: block;
        text-align: right;
        padding-left: 50%;
        position: relative;

        &::before {
            content: attr(data-label);
            position: absolute;
            left: 0.75rem;
            font-weight: 600;
            color: ${props => props.theme?.colors?.textSecondary};
        }
    }
`;

const ScoreCell = styled(TableCell)`
    font-weight: 600;
`;

const ImageCell = styled(TableCell)`
    width: 80px;
    padding: 0.5rem;

    img {
        width: 60px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }
`;

const ChartContainer = styled.div`
    margin-top: 3rem;
    padding: 2rem;
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    border-radius: 12px;
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};

    h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${props => props.theme?.colors?.text || '#1a202c'};
        margin-bottom: 2rem;
    }
`;

const BarChart = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const BarItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const BarLabel = styled.div`
    min-width: 150px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    font-size: 0.95rem;

    @media (max-width: 768px) {
        min-width: auto;
        width: 100%;
    }
`;

const BarTrack = styled.div`
    flex: 1;
    height: 30px;
    background: ${props => props.theme?.colors?.border || '#e2e8f0'};
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    min-width: 200px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const BarFill = styled.div<{ width: number; color: string }>`
    height: 100%;
    width: ${props => props.width}%;
    background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}dd);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 1rem;
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    transition: width 0.3s ease;
`;

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: linear-gradient(135deg, #48bb78, #38a169);
    padding: 1.5rem;
    border-radius: 12px;
    color: white;
    text-align: center;
    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.2);

    .stat-value {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-size: 0.9rem;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
        .stat-value {
            font-size: 2rem;
        }
    }
`;

const TopDestinationsSection = styled.div`
    margin-top: 3rem;
    padding: 2rem;
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    border-radius: 12px;
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};
`;

const DestinationCardSmall = styled.div<{ theme: any }>`
    background: ${props => props.theme?.colors?.bgSecondary || '#f7fafc'};
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(72, 187, 120, 0.2);
        background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DestinationImageSmall = styled.img`
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        height: 150px;
    }
`;

const DestinationInfoSmall = styled.div`
    flex: 1;
`;

const DestinationNameSmall = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    margin: 0 0 0.5rem 0;
`;

const DestinationRankSmall = styled.div`
    font-size: 0.9rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    margin-bottom: 0.75rem;
`;

const DestinationScoresSmall = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    font-size: 0.85rem;
    color: ${props => props.theme?.colors?.textSecondary || '#718096'};
    margin-top: 0.75rem;
`;

const ViewDetailsButtonSmall = styled.button`
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    margin-top: 0.75rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }
`;

const SectionTitleSmall = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ViewDetailsButton = styled.button`
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }

    @media (max-width: 768px) {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
    }
`;

export default function Recommendations() {
    const {theme} = useTheme();
    const {showToast} = useNotification();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [destinations, setDestinations] = useState<Map<number, Destination>>(new Map());
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [recsResponse, destsResponse] = await Promise.all([
                getAllRecommendations(),
                getAllDestinations(),
            ]);

            setRecommendations(recsResponse.data);

            const destMap = new Map();
            destsResponse.data.forEach((dest: Destination) => {
                destMap.set(dest.id, dest);
            });
            setDestinations(destMap);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getDestinationName = (destId: number) => {
        return destinations.get(destId)?.name || `Destination ${destId}`;
    };

    const getAverageScore = () => {
        if (recommendations.length === 0) return 0;
        return (recommendations.reduce((sum, rec) => sum + rec.aiScore, 0) / recommendations.length).toFixed(1);
    };

    const getTopDestinations = () => {
        const destScores: { [key: number]: { name: string; count: number; avgScore: number } } = {};

        recommendations.forEach(rec => {
            if (!destScores[rec.destinationId]) {
                destScores[rec.destinationId] = {
                    name: getDestinationName(rec.destinationId),
                    count: 0,
                    avgScore: 0,
                };
            }
            destScores[rec.destinationId].count += 1;
            destScores[rec.destinationId].avgScore += rec.aiScore;
        });

        return Object.values(destScores)
            .map(d => ({
                ...d,
                avgScore: d.avgScore / d.count,
            }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 10);
    };

    const getTop5DestinationsByAIScore = () => {
        const destScores: {
            [key: number]: { id: number; name: string; country: string; count: number; avgScore: number }
        } = {};

        recommendations.forEach(rec => {
            if (!destScores[rec.destinationId]) {
                const dest = destinations.get(rec.destinationId);
                destScores[rec.destinationId] = {
                    id: rec.destinationId,
                    name: dest?.name || getDestinationName(rec.destinationId),
                    country: dest?.country || 'Unknown',
                    count: 0,
                    avgScore: 0,
                };
            }
            destScores[rec.destinationId].count += 1;
            destScores[rec.destinationId].avgScore += rec.aiScore;
        });

        return Object.values(destScores)
            .map(d => ({
                ...d,
                avgScore: d.avgScore / d.count,
            }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 5);
    };

    if (loading) {
        return (
            <PageContainer theme={theme}>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>Loading recommendations...</p>
                </LoadingSpinner>
            </PageContainer>
        );
    }

    if (recommendations.length === 0) {
        return (
            <PageContainer theme={theme}>
                <PageHeader>
                    <PageTitle>⭐ AI Recommendations</PageTitle>
                    <PageSubtitle>Personalized destination recommendations based on AI analysis</PageSubtitle>
                </PageHeader>
                <EmptyState>
                    <div className="icon">🤖</div>
                    <h3>No recommendations yet</h3>
                    <p>Start exploring to get personalized recommendations based on your preferences.</p>
                </EmptyState>
            </PageContainer>
        );
    }

    const topDestinations = getTopDestinations();

    return (
        <PageContainer theme={theme}>
            <PageHeader>
                <PageTitle>⭐ AI Recommendations</PageTitle>
                <PageSubtitle>
                    Personalized destination recommendations based on AI analysis and user preferences
                </PageSubtitle>
            </PageHeader>

            <StatGrid>
                <StatCard>
                    <div className="stat-value">{recommendations.length}</div>
                    <div className="stat-label">Total Recommendations</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{new Set(recommendations.map(r => r.destinationId)).size}</div>
                    <div className="stat-label">Unique Destinations</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{getAverageScore()}</div>
                    <div className="stat-label">Average AI Score</div>
                </StatCard>
            </StatGrid>

            <TabContainer theme={theme}>
                <Tab
                    active={activeTab === 'table'}
                    onClick={() => setActiveTab('table')}
                    theme={theme}
                >
                    📊 Recommendations Table
                </Tab>
                <Tab
                    active={activeTab === 'chart'}
                    onClick={() => setActiveTab('chart')}
                    theme={theme}
                >
                    📈 Analytics Chart
                </Tab>
            </TabContainer>

            {activeTab === 'table' ? (
                <Table theme={theme}>
                    <TableHead>
                        <TableRow>
                            <TableHeader theme={theme}>Image</TableHeader>
                            <TableHeader theme={theme}>Destination</TableHeader>
                            <TableHeader theme={theme}>User ID</TableHeader>
                            <TableHeader theme={theme}>AI Score</TableHeader>
                            <TableHeader theme={theme}>Reason</TableHeader>
                            <TableHeader theme={theme}>Action</TableHeader>
                        </TableRow>
                    </TableHead>
                    <tbody>
                    {recommendations.map((rec, index) => {
                        const dest = destinations.get(rec.destinationId);
                        return (
                            <TableRow key={rec.id} theme={theme}>
                                <ImageCell data-label="Image" theme={theme}>
                                    <img src={`https://picsum.photos/60/40?random=${3000 + index}`} alt={dest?.name}/>
                                </ImageCell>
                                <TableCell
                                    data-label="Destination"
                                    theme={theme}
                                    style={{fontWeight: 600}}
                                >
                                    {getDestinationName(rec.destinationId)}
                                </TableCell>
                                <TableCell data-label="User ID" theme={theme}>
                                    User #{rec.userId}
                                </TableCell>
                                <ScoreCell data-label="AI Score" theme={theme}>
                                    <Badge color="green">{rec.aiScore}/100</Badge>
                                </ScoreCell>
                                <TableCell data-label="Reason" theme={theme}>
                                    {rec.reason}
                                </TableCell>
                                <TableCell data-label="Action" theme={theme}>
                                    <ViewDetailsButton onClick={() => {
                                        const destId = rec.destinationId ?? (rec as any)?.destination?.id;
                                        if (destId === undefined || destId === null) {
                                            console.warn('Missing destination id for recommendation', rec);
                                            // show user-friendly toast
                                            (showToast ?? (() => {
                                            }))('Destination id is missing for this recommendation', 'error');
                                            return;
                                        }
                                        navigate(`/destination/${destId}`);
                                    }}>
                                        View Details →
                                    </ViewDetailsButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </tbody>
                </Table>
            ) : (
                <>
                    <ChartContainer theme={theme}>
                        <h3>📈 Top Recommended Destinations</h3>
                        <BarChart>
                            {topDestinations.map(dest => (
                                <BarItem key={dest.name}>
                                    <BarLabel>{dest.name}</BarLabel>
                                    <BarTrack>
                                        <BarFill
                                            width={(dest.avgScore / 100) * 100}
                                            color="#48bb78"
                                        >
                                            {dest.avgScore.toFixed(1)}
                                        </BarFill>
                                    </BarTrack>
                                    <div style={{
                                        minWidth: '80px',
                                        textAlign: 'right',
                                        fontWeight: 600,
                                        color: theme.colors.text
                                    }}>
                                        {dest.count} rec{dest.count > 1 ? 's' : ''}
                                    </div>
                                </BarItem>
                            ))}
                        </BarChart>
                    </ChartContainer>

                    <ChartContainer theme={theme}>
                        <h3>📊 Score Distribution</h3>
                        <BarChart>
                            {[
                                {range: '90-100 (Excellent)', color: '#48bb78'},
                                {range: '80-89 (Very Good)', color: '#9ae6b4'},
                                {range: '70-79 (Good)', color: '#f6ad55'},
                                {range: '60-69 (Fair)', color: '#fc8181'},
                            ].map(score => {
                                const min = parseInt(score.range);
                                const max = parseInt(score.range) + 9;
                                const count = recommendations.filter(r => r.aiScore >= min && r.aiScore < (max + 1)).length;
                                const percentage = (count / recommendations.length) * 100;

                                return (
                                    <BarItem key={score.range}>
                                        <BarLabel>{score.range}</BarLabel>
                                        <BarTrack>
                                            <BarFill
                                                width={percentage}
                                                color={score.color}
                                            >
                                                {count}
                                            </BarFill>
                                        </BarTrack>
                                    </BarItem>
                                );
                            })}
                        </BarChart>
                    </ChartContainer>
                </>
            )}

            {/* Top 5 Destinations with Highest AI Score */}
            <TopDestinationsSection theme={theme}>
                <SectionTitleSmall>🏆 Top 5 Destinations with Highest AI Scores</SectionTitleSmall>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {getTop5DestinationsByAIScore().map((dest, index) => (
                        <DestinationCardSmall key={dest.id} theme={theme}>
                            <DestinationImageSmall
                                src={`https://picsum.photos/150/100?random=${dest.id + 6000}`}
                                alt={dest.name}
                            />
                            <DestinationInfoSmall>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <DestinationRankSmall>#{index + 1} Top Destination</DestinationRankSmall>
                                        <DestinationNameSmall>{dest.name}</DestinationNameSmall>
                                        <p style={{
                                            margin: '0.5rem 0 0 0',
                                            fontSize: '0.9rem',
                                            color: theme.colors.textSecondary
                                        }}>
                                            🌍 {dest.country}
                                        </p>
                                    </div>
                                    <div style={{textAlign: 'right', minWidth: '120px'}}>
                                        <Badge color="green" style={{fontSize: '1rem', padding: '0.5rem 1rem'}}>
                                            AI Score: {dest.avgScore.toFixed(1)}/100
                                        </Badge>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: theme.colors.textSecondary,
                                            marginTop: '0.5rem'
                                        }}>
                                            {dest.count} recommendation{dest.count > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                                <DestinationScoresSmall>
                                    <div>🏅 Avg Score: {dest.avgScore.toFixed(1)}/100</div>
                                    <div>📊 Total Recs: {dest.count}</div>
                                </DestinationScoresSmall>
                                <ViewDetailsButtonSmall onClick={() => {
                                    const dAny: any = dest as any;
                                    const destId = dAny?.id ?? dAny?.destinationId ?? dAny?.destination_id ?? dAny?.Id;
                                    if (destId === undefined || destId === null) {
                                        console.warn('Attempted to navigate to destination with missing id', dest);
                                        showToast('Destination id is missing for this item', 'error');
                                        return;
                                    }
                                    navigate(`/destination/${destId}`);
                                }}>
                                    Explore This Destination →
                                </ViewDetailsButtonSmall>
                            </DestinationInfoSmall>
                        </DestinationCardSmall>
                    ))}
                </div>
            </TopDestinationsSection>
        </PageContainer>
    );
}
