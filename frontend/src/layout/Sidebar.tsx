import { PanelMenu } from 'primereact/panelmenu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  padding: 2rem 1.5rem;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: auto;
  }
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

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.2rem;
    }

    span {
      font-size: 1.5rem;
    }
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

const UserSection = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 1rem;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #48bb78, #38a169);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-right: 0.75rem;
    color: white;
  }

  .user-details {
    flex: 1;

    .username {
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    .role {
      font-size: 0.8rem;
      color: #cbd5e0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const ThemeToggle = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-1px);
  }

  i {
    margin-right: 0.5rem;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-1px);
  }

  i {
    margin-right: 0.5rem;
  }
`;

export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const { toggleTheme, theme } = useTheme();

    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Explore',
            icon: 'pi pi-map',
            command: () => navigate('/explore')
        },
        {
            label: 'Recommendations',
            icon: 'pi pi-star',
            command: () => navigate('/recommendations')
        },
        {
            label: 'Add User',
            icon: 'pi pi-user-plus',
            command: () => navigate('/add-user')
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => navigate('/settings')
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <SidebarContainer>
            <Logo>
                <span>🌿</span>
                <h2>EcoRoute AI</h2>
            </Logo>
            <StyledPanelMenu model={items} />
            
            <ThemeToggle onClick={toggleTheme}>
                <i className={`pi ${theme.mode === 'light' ? 'pi-moon' : 'pi-sun'}`}></i>
                {theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </ThemeToggle>

            {isAuthenticated && user && (
                <UserSection>
                    <UserInfo>
                        <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                            <div className="username">{user.username}</div>
                            <div className="role">{user.role}</div>
                        </div>
                    </UserInfo>
                    <LogoutButton onClick={handleLogout}>
                        <i className="pi pi-sign-out"></i>
                        Logout
                    </LogoutButton>
                </UserSection>
            )}
        </SidebarContainer>
    );
}
