import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #48bb78, #38a169);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme?.colors?.textSecondary || '#718096'};
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background: linear-gradient(135deg, #ffffff, #f7fafc);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(72, 187, 120, 0.2);
  }

  @media (max-width: 768px) {
    border-radius: 12px;

    &:hover {
      transform: none;
    }
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #667eea;
          color: white;
          
          &:hover {
            background: #5568d3;
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #48bb78;
          border: 2px solid #48bb78;
          
          &:hover {
            background: rgba(72, 187, 120, 0.1);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #718096;

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #48bb78;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;

  .icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }

  p {
    font-size: 1.05rem;
    max-width: 400px;
    margin: 0 auto;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #48bb78;
    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const Badge = styled.span<{ color?: 'green' | 'blue' | 'purple' | 'orange' }>`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;

  ${props => {
    switch (props.color) {
      case 'blue':
        return 'background: rgba(102, 126, 234, 0.2); color: #667eea;';
      case 'purple':
        return 'background: rgba(159, 122, 234, 0.2); color: #9f7aea;';
      case 'orange':
        return 'background: rgba(237, 137, 54, 0.2); color: #ed8936;';
      default:
        return 'background: rgba(72, 187, 120, 0.2); color: #48bb78;';
    }
  }}
`;
