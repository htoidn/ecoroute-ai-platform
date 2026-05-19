import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {useAuth} from '../contexts/AuthContext';
import {type ThemeType, useTheme} from '../contexts/ThemeContext';
import {Button} from '../styles/SharedStyles';

const NavContainer = styled.nav<{ theme: ThemeType }>`
    background: ${props => props.theme.colors.cardBg};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const NavWrapper = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #48bb78, #38a169);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

const NavContent = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;

    @media (max-width: 1024px) {
        gap: 0.8rem;
    }

    @media (max-width: 768px) {
        gap: 0.5rem;
    }
`;


const AuthNavButtonsContainer = styled.div`
    display: flex;
    gap: 0.6rem;
    align-items: center;

    @media (max-width: 1024px) {
        display: none;
    }
`;

const NavLinks = styled.div<{ isOpen: boolean; theme: ThemeType }>`
    display: flex;
    gap: 0.6rem;
    align-items: center;

    @media (max-width: 1024px) {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: ${props => props.theme.colors.cardBg};
        backdrop-filter: blur(10px);
        border-bottom: 1px solid ${props => props.theme.colors.border};
        padding: 1.5rem;
        gap: 1rem;
        max-height: ${props => props.isOpen ? '500px' : '0'};
        overflow: hidden;
        transition: max-height 0.3s ease;
        box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
        z-index: 999;
    }
`;

const NavLink = styled.button<{ theme: ThemeType; isActive?: boolean }>`
    color: ${props => props.isActive ? 'white' : props.theme.colors.text};
    background: ${props => props.isActive 
        ? 'linear-gradient(135deg, #48bb78, #38a169)' 
        : props.theme.colors.bgSecondary};
    border: 1px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
    text-decoration: none;
    font-weight: ${props => props.isActive ? '700' : '600'};
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.95rem;

    &:hover {
        color: white;
        background: linear-gradient(135deg, #48bb78, #38a169);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        border-color: ${props => props.theme.colors.primary};
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 0.75rem;
        text-align: center;
        font-size: 1rem;
    }
`;

const HamburgerMenu = styled.button<{ theme: any }>`
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    gap: 0.4rem;
    padding: 0.5rem;

    @media (max-width: 1024px) {
        display: flex;
    }

    span {
        width: 24px;
        height: 3px;
        background: ${props => props.theme.colors.text};
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    &.open span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
    }

    &.open span:nth-child(2) {
        opacity: 0;
    }

    &.open span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
    }
`;

const ProfileDropdown = styled.div`
    position: relative;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ProfileButton = styled.button<{ theme: any }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${props => props.theme.colors.bgSecondary};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
        background: ${props => props.theme.colors.primary};
        color: white;
        border-color: ${props => props.theme.colors.primary};
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

const DropdownMenu = styled.div<{ isOpen: boolean; theme: any }>`
    position: absolute;
    top: 100%;
    right: 0;
    background: ${props => props.theme.colors.cardBg};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
    min-width: 200px;
    max-height: ${props => props.isOpen ? '300px' : '0'};
    overflow: hidden;
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 1001;
    margin-top: 0.5rem;

    @media (max-width: 768px) {
        position: static;
        width: auto;
        margin-top: 0;
        max-height: ${props => props.isOpen ? 'auto' : '0'};
    }
`;

const DropdownItem = styled.button<{ theme: any; isDanger?: boolean }>`
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    background: none;
    border: none;
    color: ${props => props.isDanger ? '#e53e3e' : props.theme.colors.text};
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    border-bottom: 1px solid ${props => props.theme.colors.border};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${props => props.isDanger ? 'rgba(229, 62, 62, 0.1)' : props.theme.colors.bgSecondary};
        padding-left: 1.5rem;
    }

    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
        padding: 0.75rem;

        &:hover {
            padding-left: 1rem;
        }
    }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
    display: none;

    @media (max-width: 1024px) {
        display: ${props => props.isOpen ? 'block' : 'none'};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
    }
`;

const AuthButtons = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;

        button {
            width: 100%;
        }
    }
`;

const ThemeToggle = styled.button<{ theme: any }>`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: ${props => props.theme.colors.bgSecondary};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
        background: ${props => props.theme.colors.primary};
        color: white;
        border-color: ${props => props.theme.colors.primary};
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

interface NavigationProps {
}

export default function Navigation({}: NavigationProps) {
    const {user, logout, isAuthenticated} = useAuth();
    const {theme, toggleTheme} = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate('/');
    };

    const handleLogoClick = () => {
        navigate('/');
        setMobileMenuOpen(false);
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <>
            <NavContainer theme={theme}>
                <NavWrapper>
                    <Logo onClick={handleLogoClick} title="EcoRoute AI">
                        🌍 EcoRoute AI
                    </Logo>

                    <NavContent>

                        {/* Authenticated Navigation Buttons - Visible on Desktop, Collapsible on Tablet/Mobile */}
                        {isAuthenticated && (
                            <AuthNavButtonsContainer>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/'}
                                    onClick={() => handleNavigate('/')}
                                    title="Go to Home"
                                >
                                    🏠 Home
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/explore'}
                                    onClick={() => handleNavigate('/explore')}
                                    title="Explore destinations"
                                >
                                    🗺️ Explore
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/recommendations'}
                                    onClick={() => handleNavigate('/recommendations')}
                                    title="View recommendations"
                                >
                                    ⭐ Recommendations
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/settings'}
                                    onClick={() => handleNavigate('/settings')}
                                    title="Settings"
                                >
                                    ⚙️ Settings
                                </NavLink>
                            </AuthNavButtonsContainer>
                        )}

                        {/* Theme Toggle */}
                        <ThemeToggle theme={theme} onClick={toggleTheme} title="Toggle Dark/Light mode">
                            {theme.mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </ThemeToggle>

                        {isAuthenticated ? (
                            <ProfileDropdown>
                                <ProfileButton
                                    theme={theme}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    👤 {user?.username || 'Profile'}
                                </ProfileButton>
                                <DropdownMenu isOpen={dropdownOpen} theme={theme}>
                                    <DropdownItem
                                        theme={theme}
                                        onClick={() => {
                                            handleNavigate('/profile');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        👤 My Profile
                                    </DropdownItem>
                                    <DropdownItem
                                        theme={theme}
                                        onClick={() => {
                                            handleNavigate('/settings');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        ⚙️ Settings
                                    </DropdownItem>
                                    <DropdownItem theme={theme} isDanger onClick={handleLogout}>
                                        🚪 Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </ProfileDropdown>
                        ) : (
                            <AuthButtons>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleNavigate('/login')}
                                    style={{whiteSpace: 'nowrap'}}
                                >
                                    🔓 Login
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleNavigate('/register')}
                                    style={{whiteSpace: 'nowrap'}}
                                >
                                    ✍️ Register
                                </Button>
                            </AuthButtons>
                        )}

                        {isAuthenticated && (
                            <HamburgerMenu
                                theme={theme}
                                className={mobileMenuOpen ? 'open' : ''}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </HamburgerMenu>
                        )}

                        {/* Mobile Menu - Shows when hamburger is clicked */}
                        {isAuthenticated && mobileMenuOpen && (
                            <NavLinks isOpen={mobileMenuOpen} theme={theme}>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/'}
                                    onClick={() => handleNavigate('/')}
                                >
                                    🏠 Home
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/explore'}
                                    onClick={() => handleNavigate('/explore')}
                                >
                                    🗺️ Explore
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/recommendations'}
                                    onClick={() => handleNavigate('/recommendations')}
                                >
                                    ⭐ Recommendations
                                </NavLink>
                                <NavLink
                                    theme={theme}
                                    isActive={currentPath === '/settings'}
                                    onClick={() => handleNavigate('/settings')}
                                >
                                    ⚙️ Settings
                                </NavLink>
                            </NavLinks>
                        )}
                    </NavContent>
                </NavWrapper>
            </NavContainer>

            <Overlay isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)}/>
        </>
    );
}

