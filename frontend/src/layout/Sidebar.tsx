import { PanelMenu } from 'primereact/panelmenu';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 2rem 1.5rem;
  color: white;
  height: 100vh;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #48bb78, #38a169);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  span {
    font-size: 1.8rem;
    margin-right: 0.5rem;
  }
`;

const StyledPanelMenu = styled(PanelMenu)`
  .p-panelmenu-panel {
    border: none;
    background: transparent;
    margin-bottom: 0.5rem;
  }

  .p-panelmenu-header {
    background: transparent;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    &.p-highlight {
      background: linear-gradient(135deg, #48bb78, #38a169);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
    }
  }

  .p-panelmenu-header-content {
    color: #e2e8f0;
    font-weight: 500;
  }

  .p-menuitem-link {
    color: #cbd5e0;
    padding: 0.75rem 1rem 0.75rem 2rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    margin: 2px 0;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(4px);
    }

    &.router-link-active {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
    }
  }

  .p-menuitem-icon {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }
`;

export default function Sidebar() {
    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => window.location.hash = '#/'
        },
        {
            label: 'Explore',
            icon: 'pi pi-map',
            command: () => window.location.hash = '#/explore'
        },
        {
            label: 'Recommendations',
            icon: 'pi pi-star',
            command: () => window.location.hash = '#/recommendations'
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => window.location.hash = '#/settings'
        }
    ];

    return (
        <SidebarContainer>
            <Logo>
                <span>🌿</span>
                <h2>EcoRoute AI</h2>
            </Logo>
            <StyledPanelMenu model={items} />
        </SidebarContainer>
    );
}
