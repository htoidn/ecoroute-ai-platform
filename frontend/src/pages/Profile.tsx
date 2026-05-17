import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, PageContainer, PageHeader, PageSubtitle, PageTitle } from '../styles/SharedStyles';

const ProfileWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const ProfileContainer = styled.div<{ theme: any }>`
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-top: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const SidebarCard = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.cardBg};
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 15px ${props => props.theme.colors.shadow};
    border: 1px solid ${props => props.theme.colors.border};
    text-align: center;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const AvatarContainer = styled.div`
    margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #48bb78, #38a169);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    margin: 0 auto 1rem;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);

    @media (max-width: 768px) {
        width: 100px;
        height: 100px;
        font-size: 2.5rem;
    }
`;

const UserInfo = styled.div<{ theme: any }>`
    h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 0.5rem;
    }

    p {
        color: ${props => props.theme.colors.textSecondary};
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
    }
`;

const Badge = styled.span<{ theme: any }>`
    display: inline-block;
    background: ${props => props.theme.colors.primary};
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 1rem;
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const Card = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.cardBg};
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 15px ${props => props.theme.colors.shadow};
    border: 1px solid ${props => props.theme.colors.border};

    h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${props => props.theme.colors.text};
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;

        h3 {
            font-size: 1.1rem;
        }
    }
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InfoField = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;

    label {
        font-size: 0.85rem;
        font-weight: 600;
        color: ${props => props.theme.colors.textSecondary};
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    p {
        font-size: 1rem;
        color: ${props => props.theme.colors.text};
        font-weight: 500;
    }
`;

const EditForm = styled.form<{ theme: any }>`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormField = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;

    label {
        font-size: 0.9rem;
        font-weight: 600;
        color: ${props => props.theme.colors.text};
        margin-bottom: 0.5rem;
    }

    input, textarea {
        padding: 0.75rem 1rem;
        border: 2px solid ${props => props.theme.colors.border};
        border-radius: 8px;
        background: ${props => props.theme.colors.bgSecondary};
        color: ${props => props.theme.colors.text};
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.3s ease;

        &:focus {
            outline: none;
            border-color: #48bb78;
            box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
        }

        &::placeholder {
            color: ${props => props.theme.colors.textSecondary};
        }
    }

    textarea {
        resize: vertical;
        min-height: 100px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;

        button {
            width: 100%;
        }
    }
`;

const SuccessMessage = styled.div<{ theme: any }>`
    padding: 1rem;
    background: rgba(72, 187, 120, 0.1);
    border-left: 4px solid #48bb78;
    border-radius: 8px;
    color: #22543d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const StatCard = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.bgSecondary};
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid ${props => props.theme.colors.border};

    .stat-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: ${props => props.theme.colors.primary};
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.85rem;
        color: ${props => props.theme.colors.textSecondary};
        font-weight: 500;
    }
`;

interface ProfileFormData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
}

export default function Profile() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>(() => {
        const saved = localStorage.getItem('user-profile');
        return saved ? JSON.parse(saved) : {
            username: user?.username || 'EcoTraveler',
            email: localStorage.getItem('user-email') || 'user@ecoroute.ai',
            firstName: 'Eco',
            lastName: 'Traveler',
            bio: 'Passionate about sustainable tourism and eco-friendly travel.',
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('user-profile', JSON.stringify(formData));
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleChangePassword = () => {
        const newPassword = prompt('Enter your new password:');
        if (newPassword && newPassword.length >= 6) {
            alert('✅ Password changed successfully!');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <PageContainer theme={theme}>
            <PageHeader>
                <PageTitle>👤 My Profile</PageTitle>
                <PageSubtitle>
                    Manage your personal information and account settings
                </PageSubtitle>
            </PageHeader>

            <ProfileWrapper>
                {showSuccess && (
                    <SuccessMessage theme={theme}>
                        ✅ Profile updated successfully!
                    </SuccessMessage>
                )}

                <ProfileContainer theme={theme}>
                    {/* Sidebar */}
                    <SidebarCard theme={theme}>
                        <AvatarContainer>
                            <Avatar>👤</Avatar>
                        </AvatarContainer>
                        <UserInfo theme={theme}>
                            <h2>{formData.username}</h2>
                            <p>{formData.email}</p>
                            <Badge theme={theme}>
                                {user?.role === 'ADMIN' ? '🔑 Admin' : '🌿 Eco-Traveler'}
                            </Badge>
                        </UserInfo>

                        <ButtonGroup style={{ marginTop: '2rem' }}>
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditing(!isEditing)}
                                style={{ width: '100%' }}
                            >
                                {isEditing ? '❌ Cancel' : '✏️ Edit'}
                            </Button>
                        </ButtonGroup>
                    </SidebarCard>

                    {/* Main Content */}
                    <MainContent>
                        {/* Profile Info */}
                        {!isEditing ? (
                            <Card theme={theme}>
                                <h3>📋 Profile Information</h3>
                                <InfoGrid>
                                    <InfoField theme={theme}>
                                        <label>Full Name</label>
                                        <p>{formData.firstName} {formData.lastName}</p>
                                    </InfoField>
                                    <InfoField theme={theme}>
                                        <label>Email</label>
                                        <p>{formData.email}</p>
                                    </InfoField>
                                    <InfoField theme={theme}>
                                        <label>Username</label>
                                        <p>{formData.username}</p>
                                    </InfoField>
                                    <InfoField theme={theme}>
                                        <label>Account Status</label>
                                        <p style={{ color: '#48bb78' }}>✅ Active</p>
                                    </InfoField>
                                    <InfoField theme={theme} style={{ gridColumn: '1 / -1' }}>
                                        <label>Bio</label>
                                        <p>{formData.bio}</p>
                                    </InfoField>
                                </InfoGrid>
                            </Card>
                        ) : (
                            <Card theme={theme}>
                                <h3>✏️ Edit Profile</h3>
                                <EditForm theme={theme} onSubmit={handleSave}>
                                    <FormField theme={theme}>
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField theme={theme}>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField theme={theme}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField theme={theme}>
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </FormField>
                                    <FormField theme={theme} style={{ gridColumn: '1 / -1' }}>
                                        <label htmlFor="bio">Bio</label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Tell us about your travel preferences..."
                                        />
                                    </FormField>

                                    <ButtonGroup style={{ gridColumn: '1 / -1' }}>
                                        <Button type="submit" variant="primary">
                                            💾 Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            ❌ Cancel
                                        </Button>
                                    </ButtonGroup>
                                </EditForm>
                            </Card>
                        )}

                        {/* Account Statistics */}
                        <Card theme={theme}>
                            <h3>📊 Your Activity</h3>
                            <StatsGrid>
                                <StatCard theme={theme}>
                                    <div className="stat-value">24</div>
                                    <div className="stat-label">Destinations Explored</div>
                                </StatCard>
                                <StatCard theme={theme}>
                                    <div className="stat-value">8</div>
                                    <div className="stat-label">AI Recommendations</div>
                                </StatCard>
                                <StatCard theme={theme}>
                                    <div className="stat-value">156</div>
                                    <div className="stat-label">CO₂ Saved (kg)</div>
                                </StatCard>
                            </StatsGrid>
                        </Card>

                        {/* Security Settings */}
                        <Card theme={theme}>
                            <h3>🔒 Security & Privacy</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    background: `${theme.colors.bgSecondary}`,
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.colors.border}`
                                }}>
                                    <p style={{ color: theme.colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                                        Password
                                    </p>
                                    <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Last changed 3 months ago
                                    </p>
                                    <Button variant="secondary" onClick={handleChangePassword}>
                                        🔐 Change Password
                                    </Button>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(72, 187, 120, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(72, 187, 120, 0.3)'
                                }}>
                                    <p style={{ color: theme.colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                                        Two-Factor Authentication
                                    </p>
                                    <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        ✅ Enabled - Your account is secure
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Danger Zone */}
                        <Card theme={theme}>
                            <h3 style={{ color: '#e53e3e' }}>⚠️ Danger Zone</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                            logout();
                                            alert('Account deletion requested. Please contact support.');
                                        }
                                    }}
                                    style={{ color: '#e53e3e', borderColor: '#e53e3e', width: '100%' }}
                                >
                                    🗑️ Delete Account
                                </Button>
                            </div>
                        </Card>
                    </MainContent>
                </ProfileContainer>
            </ProfileWrapper>
        </PageContainer>
    );
}

