import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTourism } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const TourismCardContainer = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.cardBg};
    border-radius: 16px;
    padding: 2rem;
    border: 2px solid ${props => props.theme.colors.border};
    box-shadow: 0 4px 15px ${props => props.theme.colors.shadow};
`;

const TourismHeader = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${props => props.theme?.colors?.text || '#333'};
`;

const AttractionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

	&::-webkit-scrollbar-track {
		background: ${props => props.theme?.colors?.bgSecondary || '#f5f5f5'};
		border-radius: 4px;
	}

    &::-webkit-scrollbar-thumb {
        background: #48bb78;
        border-radius: 4px;

        &:hover {
            background: #38a169;
        }
    }
`;

const AttractionItem = styled.div<{ theme: any }>`
	padding: 1rem;
	background: ${props => props.theme.colors.bgSecondary || '#f9f9f9'};
	border-radius: 12px;
	border-left: 4px solid #48bb78;
	cursor: pointer;
	transition: all 0.3s ease;

    &:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(72, 187, 120, 0.2);
    }

    .name {
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 0.3rem;
    }

    .category {
        font-size: 0.8rem;
        color: #48bb78;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .address {
        font-size: 0.85rem;
        color: ${props => props.theme.colors.textSecondary};
        margin-bottom: 0.3rem;
    }

    .description {
        font-size: 0.8rem;
        color: ${props => props.theme.colors.textSecondary};
        line-height: 1.4;
    }
`;

const LoadingText = styled.p`
    text-align: center;
    color: ${props => props.theme?.colors?.textSecondary || '#666'};
    font-style: italic;
    padding: 2rem;
`;

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
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

const SearchButton = styled.button`
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

interface TourismCardProps {
    latitude?: number;
    longitude?: number;
    radius?: number;
}

const TourismCard: React.FC<TourismCardProps> = ({
    latitude = 51.5074,
    longitude = -0.1278,
    radius = 5
}) => {
    const { theme } = useTheme();
    const [lat, setLat] = useState(latitude);
    const [lon, setLon] = useState(longitude);
    const [rad, setRad] = useState(radius);
    const [attractions, setAttractions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchAttractions = async () => {
        try {
            setLoading(true);
            const response = await getTourism(lat, lon, rad);
            setAttractions(response.data);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch tourism attractions');
            console.error('Tourism API error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchAttractions();
    }, []);

    return (
        <TourismCardContainer theme={theme}>
            <TourismHeader theme={theme}>🏛️ Tourism Attractions</TourismHeader>

            <InputContainer>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                        Latitude
                    </label>
                    <Input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value))}
                        placeholder="Latitude"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                        Longitude
                    </label>
                    <Input
                        type="number"
                        step="0.0001"
                        value={lon}
                        onChange={(e) => setLon(parseFloat(e.target.value))}
                        placeholder="Longitude"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                        Radius (km)
                    </label>
                    <Input
                        type="number"
                        value={rad}
                        onChange={(e) => setRad(parseInt(e.target.value) || 5)}
                        placeholder="Radius"
                    />
                </div>
            </InputContainer>

            <SearchButton onClick={searchAttractions}>Search Attractions</SearchButton>

            {loading && <LoadingText theme={theme}>Loading attractions...</LoadingText>}
            {error && <LoadingText theme={theme}>{error}</LoadingText>}

            {!loading && attractions.length > 0 && (
                <AttractionGrid>
                    {attractions.map((attraction, index) => (
                        <AttractionItem key={index} theme={theme}>
                            <div className="name">{attraction.name}</div>
                            <div className="category">{attraction.category || attraction.type}</div>
                            {attraction.address && <div className="address">📍 {attraction.address}</div>}
                            {attraction.description && <div className="description">{attraction.description}</div>}
                        </AttractionItem>
                    ))}
                </AttractionGrid>
            )}

            {!loading && attractions.length === 0 && !error && (
                <LoadingText theme={theme}>No attractions found. Try searching with different coordinates.</LoadingText>
            )}
        </TourismCardContainer>
    );
};

export default TourismCard;

