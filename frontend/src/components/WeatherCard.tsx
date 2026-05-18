import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getWeather } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const WeatherCardContainer = styled.div<{ theme: any }>`
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

const WeatherHeader = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.theme?.colors?.text || '#333'};
`;

const WeatherInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const WeatherItem = styled.div`
	padding: 1rem;
	background: ${props => props.theme?.colors?.bgSecondary || '#f5f5f5'};
	border-radius: 12px;
	text-align: center;

    .label {
        font-size: 0.85rem;
        color: ${props => props.theme?.colors?.textSecondary || '#666'};
        margin-bottom: 0.5rem;
    }

    .value {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${props => props.theme?.colors?.primary || '#48bb78'};
    }
`;

const WeatherDescription = styled.p`
    text-align: center;
    font-size: 0.95rem;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
    text-transform: capitalize;
    margin-top: 1rem;
`;

const LoadingText = styled.p`
    text-align: center;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
    font-style: italic;
`;

interface WeatherCardProps {
    city?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city = 'London' }) => {
    const { theme } = useTheme();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await getWeather(city);
                setWeather(response.data);
                setError('');
            } catch (err: any) {
                setError(`Failed to fetch weather for ${city}`);
                console.error('Weather API error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    if (loading) {
        return <LoadingText theme={theme}>Loading weather...</LoadingText>;
    }

    if (error) {
        return <LoadingText theme={theme}>{error}</LoadingText>;
    }

    if (!weather) {
        return <LoadingText theme={theme}>No weather data available</LoadingText>;
    }

    return (
        <WeatherCardContainer theme={theme}>
            <WeatherHeader theme={theme}>
                🌤️ Weather in {weather.city || city}
            </WeatherHeader>

            <WeatherInfo>
                <WeatherItem theme={theme}>
                    <div className="label">Temperature</div>
                    <div className="value">{weather.temperature?.toFixed(1) || 'N/A'}°C</div>
                </WeatherItem>

                <WeatherItem theme={theme}>
                    <div className="label">Humidity</div>
                    <div className="value">{weather.humidity || 'N/A'}%</div>
                </WeatherItem>

                <WeatherItem theme={theme}>
                    <div className="label">Wind Speed</div>
                    <div className="value">{weather.windSpeed?.toFixed(1) || 'N/A'} m/s</div>
                </WeatherItem>

                <WeatherItem theme={theme}>
                    <div className="label">Condition</div>
                    <div className="value">{weather.condition || 'N/A'}</div>
                </WeatherItem>
            </WeatherInfo>

            <WeatherDescription theme={theme}>
                {weather.description}
            </WeatherDescription>
        </WeatherCardContainer>
    );
};

export default WeatherCard;

