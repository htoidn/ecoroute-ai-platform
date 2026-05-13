import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import { recommendDestination } from '../services/api';
import styled from 'styled-components';

const HomeContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #2d3748, #4a5568);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    font-size: 1.2rem;
    color: #718096;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const ResultsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #48bb78;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }

  p {
    font-size: 1.1rem;
    max-width: 400px;
    margin: 0 auto;
  }
`;

export default function Home() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!input.trim()) return;

        setLoading(true);
        try {
            const response = await recommendDestination(input);
            setResults(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <HomeContainer>
            <HeroSection>
                <h1>Smart Sustainable Tourism</h1>
                <p>
                    Discover eco-friendly destinations tailored to your preferences.
                    Find the perfect balance between sustainability, cost, and comfort.
                </p>
            </HeroSection>

            <SearchBar
                value={input}
                onChange={setInput}
                onSearch={search}
            />

            <ResultsContainer>
                {loading && (
                    <LoadingSpinner>
                        <div className="spinner"></div>
                        <p>Finding your perfect eco-friendly destinations...</p>
                    </LoadingSpinner>
                )}

                {!loading && results.length === 0 && input && (
                    <EmptyState>
                        <div className="icon">🌍</div>
                        <h3>No destinations found</h3>
                        <p>Try adjusting your search terms or explore different preferences.</p>
                    </EmptyState>
                )}

                {!loading && results.length > 0 && (
                    <div>
                        {results.map((item, index) => (
                            <DestinationCard key={index} item={item} />
                        ))}
                    </div>
                )}

                {!loading && !input && (
                    <EmptyState>
                        <div className="icon">🔍</div>
                        <h3>Start your eco-journey</h3>
                        <p>Search for sustainable destinations that match your travel preferences.</p>
                    </EmptyState>
                )}
            </ResultsContainer>
        </HomeContainer>
    );
}
