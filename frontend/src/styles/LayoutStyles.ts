import styled from 'styled-components';
import type { ThemeType } from '../contexts/ThemeContext';

export const Container = styled.div<{ theme?: ThemeType }>`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme?.colors?.bg || '#f5f7fa'};
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SidebarWrapper = styled.div<{ theme?: ThemeType }>`
  width: 280px;
  background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
  border-right: 1px solid #4a5568;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  max-height: 100vh;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.03)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.02)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-height: auto;
    border-right: none;
    border-bottom: 1px solid #4a5568;
    padding: 1rem 0;
  }
`;

export const MainContent = styled.div<{ theme?: ThemeType }>`
  flex: 1;
  padding: 2rem;
  background: ${props => props.theme?.colors?.bg || '#f5f7fa'};
  min-height: 100vh;
  position: relative;
  transition: background-color 0.3s ease;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(102,126,234,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;