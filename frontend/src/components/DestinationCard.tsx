import {Card} from 'primereact/card';
import {Badge} from 'primereact/badge';
import {ProgressBar} from 'primereact/progressbar';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    margin-bottom: 1.5rem;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: white;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        border-color: #48bb78;
    }

    .p-card-body {
        padding: 0;
    }

    .p-card-content {
        padding: 1.5rem;
    }

    .p-card-title {
        color: #2d3748;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .p-card-subtitle {
        color: #718096;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`;

const CardHeader = styled.div`
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const DestinationIcon = styled.div`
    font-size: 2rem;
    margin-right: 1rem;
`;

const ScoreContainer = styled.div`
    text-align: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1rem;
    border-radius: 12px;
    min-width: 80px;
`;

const ScoreValue = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
`;

const ScoreLabel = styled.div`
    font-size: 0.8rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
`;

const MetricItem = styled.div`
    text-align: center;
    padding: 0.75rem;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
`;

const MetricLabel = styled.div`
    font-size: 0.8rem;
    color: #718096;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const Tag = styled(Badge)`
    background: linear-gradient(135deg, #ed64a6, #d53f8c);
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
`;

const getDestinationIcon = (name: string) => {
    const icons: { [key: string]: string } = {
        'Berlin': '🏛️',
        'Hamburg': '🚢',
        'Munich': '🏰',
        'Cologne': '⛪',
        'Frankfurt': '🏦',
        'Stuttgart': '🏭',
        'Düsseldorf': '🛍️',
        'Leipzig': '🎭',
        'Dresden': '🏛️',
        'Hannover': '🌳',
        'Nuremberg': '🏰',
        'Bremen': '🏰',
        'Essen': '🌱',
        'Freiburg': '☀️',
        'Heidelberg': '🏰',
        'Augsburg': '💧',
        'Wiesbaden': '♨️',
        'Münster': '🚴',
        'Karlsruhe': '🏛️',
        'Bonn': '🌳',
        'Mainz': '🍷',
        'Kiel': '⛵',
        'Rostock': '🏖️',
        'Erfurt': '🏰',
        'Magdeburg': '🏛️',
        'Potsdam': '🏰',
        'Regensburg': '🏰',
        'Passau': '🌊',
        'Ulm': '⛪',
        'Tübingen': '🎓',
        'Jena': '🔬',
        'Weimar': '🎭',
        'Saarbrücken': '🌉',
        'Flensburg': '🌊',
        'Cottbus': '🌲',
        'Görlitz': '🏰',
        'Bayreuth': '🎵',
        'Bamberg': '🏛️',
        'Lübeck': '🏰'
    };
    return icons[name] || '🏙️';
};

interface DestinationItem {
    name?: string;
    description?: string;
    score?: number;
    ai_score?: number;
    sustainability_score?: number;
    cost_index?: number;
    crowd_index?: number;
    country?: string;
    tags?: string;
    // Add other properties as needed
}

export default function DestinationCard({item}: { item: DestinationItem }) {
    const score = item.score || item.ai_score || 0;
    const sustainabilityScore = item.sustainability_score || 0;
    const costIndex = item.cost_index || 0;
    const crowdIndex = item.crowd_index || 0;

    return (<StyledCard>
        <CardHeader>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <DestinationIcon>{getDestinationIcon(item.name || '')}</DestinationIcon>
                <div>
                    <div className="p-card-title">{item.name}</div>
                    <div className="p-card-subtitle">{item.country}</div>
                </div>
            </div>
            <ScoreContainer>
                <ScoreValue>{score.toFixed(1)}</ScoreValue>
                <ScoreLabel>Score</ScoreLabel>
            </ScoreContainer>
        </CardHeader>

        <div className="p-card-content">
            <p style={{color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem'}}>
                {item.description}
            </p>

            <MetricsGrid>
                <MetricItem>
                    <MetricLabel>Sustainability</MetricLabel>
                    <MetricValue>{sustainabilityScore.toFixed(1)}/100</MetricValue>
                    <ProgressBar
                        value={sustainabilityScore}
                        showValue={false}
                        style={{height: '6px', marginTop: '0.5rem'}}
                        color="#48bb78"
                    />
                </MetricItem>
                <MetricItem>
                    <MetricLabel>Cost Index</MetricLabel>
                    <MetricValue>{costIndex.toFixed(1)}</MetricValue>
                </MetricItem>
                <MetricItem>
                    <MetricLabel>Crowd Level</MetricLabel>
                    <MetricValue>{crowdIndex.toFixed(1)}/100</MetricValue>
                </MetricItem>
            </MetricsGrid>

            {item.tags && (<TagsContainer>
                {item.tags.split(',').slice(0, 4).map((tag: string, index: number) => (
                    <Tag key={index} value={tag.trim()}/>))}
            </TagsContainer>)}
        </div>
    </StyledCard>);
}
