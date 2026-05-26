import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCarbon } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const EcoScoreCardContainer = styled.div<{ theme: any }>`
    background: linear-gradient(135deg, ${props => props.theme.colors.cardBg}, rgba(72, 187, 120, 0.08));
    border-radius: 16px;
    padding: 2rem;
    border: 2px solid ${props => props.theme.colors.border};
    box-shadow: 0 4px 15px ${props => props.theme.colors.shadow};
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(72, 187, 120, 0.2);
    }
`;

const EcoScoreHeader = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${props => props.theme?.colors?.text || '#333'};
`;

const ScoreContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
`;

const ScoreItem = styled.div<{ level?: 'high' | 'medium' | 'low' }>`
	padding: 1.5rem;
	background: ${props => props.theme?.colors?.bgSecondary || '#f5f5f5'};
	border-radius: 12px;
	border-left: 4px solid ${props => {
        switch (props.level) {
            case 'high': return '#38a169';
            case 'medium': return '#f6ad55';
            case 'low': return '#f56565';
            default: return '#48bb78';
        }
    }};

    .label {
        font-size: 0.85rem;
        color: ${props => props.theme?.colors?.textSecondary || '#666'};
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .value {
        font-size: 1.5rem;
        font-weight: 700;
        color: ${props => {
            switch (props.level) {
                case 'high': return '#38a169';
                case 'medium': return '#f6ad55';
                case 'low': return '#f56565';
                default: return '#48bb78';
            }
        }};
    }
`;

const TransportOptions = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const TransportButton = styled.button<{ selected: boolean }>`
    padding: 0.75rem;
    border: 2px solid ${props => props.selected ? '#48bb78' : '#ddd'};
    background: ${props => props.selected ? 'rgba(72, 187, 120, 0.1)' : 'white'};
    border-radius: 8px;
    color: ${props => props.theme?.colors?.text || '#333'};
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
        border-color: #48bb78;
        background: rgba(72, 187, 120, 0.1);
    }
`;

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.95rem;

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }
`;

const LoadingText = styled.p`
    text-align: center;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
    font-style: italic;
`;

const CalculateButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

interface EcoScoreCardProps {
    initialDistance?: number;
    initialTransport?: string;
}

const EcoScoreCard: React.FC<EcoScoreCardProps> = ({
    initialDistance = 100,
    initialTransport = 'car'
}) => {
    const { theme } = useTheme();
    const [transportType, setTransportType] = useState(initialTransport);
    const [distance, setDistance] = useState(initialDistance);
    const [carbon, setCarbon] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const transportOptions = ['flight', 'car', 'bus', 'train'];

    const calculateCarbon = async () => {
        try {
            setLoading(true);
            const response = await getCarbon(transportType, distance);
            setCarbon(response.data);
            setError('');
        } catch (err: any) {
            setError('Failed to calculate carbon emissions');
            console.error('Carbon API error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateCarbon();
    }, []);

    const getEcoLevel = (): 'high' | 'medium' | 'low' => {
        if (!carbon) return 'medium';
        const emissions = carbon.carbonKg;
        if (emissions < 50) return 'high';
        if (emissions < 200) return 'medium';
        return 'low';
    };

    const getEcoMessage = (): string => {
        const level = getEcoLevel();
        switch (level) {
            case 'high':
                return '🌿 Excellent! This is an eco-friendly choice.';
            case 'medium':
                return '🌱 Good choice. Consider alternatives to reduce emissions.';
            case 'low':
                return '⚠️ High emissions. Consider more sustainable transport.';
            default:
                return '';
        }
    };

    return (
        <EcoScoreCardContainer theme={theme}>
            <EcoScoreHeader theme={theme}>♻️ Carbon Emissions Calculator</EcoScoreHeader>

            <TransportOptions>
                {transportOptions.map((option) => (
                    <TransportButton
                        key={option}
                        selected={transportType === option}
                        onClick={() => setTransportType(option)}
                        theme={theme}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </TransportButton>
                ))}
            </TransportOptions>

            <InputContainer>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                        Distance (km)
                    </label>
                    <Input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                        placeholder="Enter distance in km"
                    />
                </div>
            </InputContainer>

            <CalculateButton onClick={calculateCarbon}>Calculate Emissions</CalculateButton>

            {loading && <LoadingText theme={theme}>Calculating...</LoadingText>}
            {error && <LoadingText theme={theme}>{error}</LoadingText>}

            {carbon && (
                <>
                    <ScoreContainer>
                        <ScoreItem theme={theme} level={getEcoLevel()}>
                            <div className="label">Carbon Emissions</div>
                            <div className="value">{carbon.carbonKg?.toFixed(2) || 'N/A'} kg</div>
                        </ScoreItem>

                        <ScoreItem theme={theme}>
                            <div className="label">Eco-Friendliness</div>
                            <div className="value" style={{ fontSize: '2rem' }}>
                                {getEcoLevel() === 'high' ? '⭐⭐⭐' : getEcoLevel() === 'medium' ? '⭐⭐' : '⭐'}
                            </div>
                        </ScoreItem>
                    </ScoreContainer>

                    <p style={{
                        padding: '1rem',
                        background: 'rgba(72, 187, 120, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: theme?.colors?.text || '#333',
                        fontWeight: 600
                    }}>
                        {getEcoMessage()}
                    </p>
                </>
            )}
        </EcoScoreCardContainer>
    );
};

export default EcoScoreCard;

