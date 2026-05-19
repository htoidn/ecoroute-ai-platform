import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './contexts/AuthContext';
import { useTheme, type ThemeType } from './contexts/ThemeContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import Navigation from './components/Navigation';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Recommendations from './pages/Recommendations';
import DestinationDetail from './pages/DestinationDetail';
import RecommendationDetail from './pages/RecommendationDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Settings from './pages/Settings';
import AddUserPage from './pages/AddUserPage';
import Profile from './pages/Profile';

const AppWrapper = styled.div<{ theme: ThemeType }>`
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
`;

// Protected Route Component
interface ProtectedRouteProps {
    element: React.ReactElement;
    isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAuthenticated }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
    const { isAuthenticated, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return (
            <AppWrapper theme={theme}>
                <Navigation />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(72, 187, 120, 0.2)',
                            borderTop: '4px solid #48bb78',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }}></div>
                        <p>Loading your eco-journey...</p>
                    </div>
                </div>
            </AppWrapper>
        );
    }

    return (
        <AppWrapper theme={theme}>
            <LocalizationProvider>
                <NotificationProvider>
                    <Navigation />
                    <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={<ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/explore"
                    element={<ProtectedRoute element={<Explore />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/recommendations"
                    element={<ProtectedRoute element={<Recommendations />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/destination/:id"
                    element={<ProtectedRoute element={<DestinationDetail />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/recommendation/:id"
                    element={<ProtectedRoute element={<RecommendationDetail />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/settings"
                    element={<ProtectedRoute element={<Settings />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/profile"
                    element={<ProtectedRoute element={<Profile />} isAuthenticated={isAuthenticated} />}
                />
                <Route
                    path="/add-user"
                    element={<ProtectedRoute element={<AddUserPage />} isAuthenticated={isAuthenticated} />}
                />

                {/* Catch-all Route */}
                <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
                    </Routes>
                </NotificationProvider>
            </LocalizationProvider>

            <style>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </AppWrapper>
    );
}

export default App;
