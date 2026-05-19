import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getRoute } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const RouteCardContainer = styled.div<{ theme: any }>`
    background: linear-gradient(135deg, ${props => props.theme.colors.cardBg}, rgba(72, 187, 120, 0.05));
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

const RouteHeader = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${props => props.theme?.colors?.text || '#333'};
`;

const CoordinateInput = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const CoordinateGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
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

const RouteButton = styled.button`
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

const RouteInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const RouteItem = styled.div<{ theme: any }>`
    padding: 1.5rem;
    background: ${props => props.theme.colors.searchBg || '#f5f5f5'};
    border-radius: 12px;
    border-top: 4px solid #48bb78;

    .label {
        font-size: 0.85rem;
        color: ${props => props.theme.colors.textSecondary};
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .value {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${props => props.theme.colors.primary};
    }

    .unit {
        font-size: 0.8rem;
        color: ${props => props.theme.colors.textSecondary};
        margin-top: 0.3rem;
    }
`;

const LoadingText = styled.p`
    text-align: center;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
    font-style: italic;
    margin-top: 1rem;
`;

interface RouteCardProps {
    startLat?: number;
    startLon?: number;
    endLat?: number;
    endLon?: number;
}

const RouteCard: React.FC<RouteCardProps> = ({
    startLat = 51.5074,
    startLon = -0.1278,
    endLat = 48.8566,
    endLon = 2.3522
}) => {
    const { theme } = useTheme();
    const [slat, setStartLat] = useState(startLat);
    const [slon, setStartLon] = useState(startLon);
    const [elat, setEndLat] = useState(endLat);
    const [elon, setEndLon] = useState(endLon);
    const [route, setRoute] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateRoute = async () => {
        try {
            setLoading(true);
            const response = await getRoute(slat, slon, elat, elon);
            setRoute(response.data);
            setError('');
        } catch (err: any) {
            setError('Failed to calculate route');
            console.error('Route API error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateRoute();
    }, []);

    const formatDistance = (meters: number) => {
        return (meters / 1000).toFixed(2);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <RouteCardContainer theme={theme}>
            <RouteHeader theme={theme}>🗺️ Route Calculator</RouteHeader>

            <CoordinateInput>
                <CoordinateGroup>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                            Start Latitude
                        </label>
                        <Input
                            type="number"
                            step="0.0001"
                            value={slat}
                            onChange={(e) => setStartLat(parseFloat(e.target.value))}
                            placeholder="Start Latitude"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                            Start Longitude
                        </label>
                        <Input
                            type="number"
                            step="0.0001"
                            value={slon}
                            onChange={(e) => setStartLon(parseFloat(e.target.value))}
                            placeholder="Start Longitude"
                        />
                    </div>
                </CoordinateGroup>

                <CoordinateGroup>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                            End Latitude
                        </label>
                        <Input
                            type="number"
                            step="0.0001"
                            value={elat}
                            onChange={(e) => setEndLat(parseFloat(e.target.value))}
                            placeholder="End Latitude"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                            End Longitude
                        </label>
                        <Input
                            type="number"
                            step="0.0001"
                            value={elon}
                            onChange={(e) => setEndLon(parseFloat(e.target.value))}
                            placeholder="End Longitude"
                        />
                    </div>
                </CoordinateGroup>
            </CoordinateInput>

            <RouteButton onClick={calculateRoute}>Calculate Route</RouteButton>

            {loading && <LoadingText theme={theme}>Calculating route...</LoadingText>}
            {error && <LoadingText theme={theme}>{error}</LoadingText>}

            {route && (
                <RouteInfo>
                    <RouteItem theme={theme}>
                        <div className="label">Distance</div>
                        <div className="value">{formatDistance(route.distance)}</div>
                        <div className="unit">kilometers</div>
                    </RouteItem>

                    <RouteItem theme={theme}>
                        <div className="label">Estimated Duration</div>
                        <div className="value">{formatDuration(route.duration)}</div>
                        <div className="unit">by car</div>
                    </RouteItem>
                </RouteInfo>
            )}
        </RouteCardContainer>
    );
};

export default RouteCard;

