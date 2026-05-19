import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {useTheme} from '../contexts/ThemeContext';
import {useLocalization, type Language} from '../contexts/LocalizationContext';
import {useAuth} from '../contexts/AuthContext';
import {Button, PageContainer, PageHeader, PageSubtitle, PageTitle,} from '../styles/SharedStyles';
import {exportUserDataToPDF, deleteUserAccount, fetchUserDataForExport} from '../services/dataExport';

const SettingsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const SettingCard = styled.div`
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};
    border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 8px 25px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.15)'};
    }

    h3 {
        font-size: 1.3rem;
        font-weight: 700;
        color: ${props => props.theme?.colors?.text || '#1a202c'};
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    p {
        color: ${props => props.theme?.colors?.textSecondary || '#718096'};
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }
`;

const ToggleSwitch = styled.input.attrs({type: 'checkbox'})`
    appearance: none;
    -webkit-appearance: none;
    width: 60px;
    height: 30px;
    background: ${props => props.checked ? '#48bb78' : '#cbd5e0'};
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    outline: none;

    &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: ${props => props.checked ? '33px' : '3px'};
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        transition: left 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:hover {
        box-shadow: 0 0 10px ${props => props.checked ? 'rgba(72, 187, 120, 0.3)' : 'rgba(203, 213, 224, 0.3)'};
    }
`;

const RadioGroup = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        gap: 0.5rem;
    }
`;

const RadioButton = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    flex: 1;
    min-width: 150px;

    input[type='radio'] {
        cursor: pointer;
        width: 18px;
        height: 18px;
        accent-color: #48bb78;
    }

    span {
        color: ${props => props.theme?.colors?.text || '#1a202c'};
        font-weight: 500;
    }

    @media (max-width: 768px) {
        flex: 0 1 auto;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    border-radius: 8px;
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }

    option {
        background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
        color: ${props => props.theme?.colors?.text || '#1a202c'};
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
    border-radius: 8px;
    background: ${props => props.theme?.colors?.cardBg || '#ffffff'};
    color: ${props => props.theme?.colors?.text || '#1a202c'};
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }

    &::placeholder {
        color: ${props => props.theme?.colors?.textSecondary || '#cbd5e0'};
    }
`;

const ControlRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
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

const InfoMessage = styled.div`
    padding: 1rem;
    background: rgba(72, 187, 120, 0.1);
    border-left: 4px solid #48bb78;
    border-radius: 8px;
    color: #22543d;
    font-size: 0.9rem;
    margin-top: 1.5rem;

    strong {
        display: block;
        margin-bottom: 0.25rem;
    }
`;

export default function Settings() {
    const {theme, toggleTheme} = useTheme();
    const {language, setLanguage, t} = useLocalization();
    const {user} = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('user-settings');
        return saved ? JSON.parse(saved) : {
            theme: theme.mode,
            language: 'en',
            notifications: true,
            emailNotifications: false,
            seoLocation: '',
            visitingReason: 'leisure',
            sustainabilityLevel: 'high',
            budgetRange: 'medium',
            savedMessage: false,
        };
    });

    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggle = (key: string, value: boolean) => {
        const updated = {...settings, [key]: value};
        setSettings(updated);
        localStorage.setItem('user-settings', JSON.stringify(updated));
    };

    const handleChange = (key: string, value: string | boolean) => {
        const updated = {...settings, [key]: value};
        setSettings(updated);

        // If language changed, update localization
        if (key === 'language') {
            setLanguage(value as Language);
        }
    };

    const handleSave = () => {
        localStorage.setItem('user-settings', JSON.stringify(settings));
        setSettings({...settings, savedMessage: true});
        setTimeout(() => {
            setSettings((prev: any) => ({...prev, savedMessage: false}));
        }, 3000);
    };

    const handleThemeChange = (mode: 'light' | 'dark') => {
        handleChange('theme', mode);
        toggleTheme();
    };

    const handleExportData = async () => {
        // Get user ID from localStorage or URL
        let userId = (user as any)?.id;
        if (!userId) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    userId = userData.id;
                } catch {
                    // continue
                }
            }
        }

        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        setIsExporting(true);
        try {
            const data = await fetchUserDataForExport(userId);
            await exportUserDataToPDF(data.user, data.recommendations);
            alert(t('data.export_success'));
        } catch (error) {
            console.error('Export error:', error);
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        // Get user ID from localStorage or URL
        let userId = (user as any)?.id;
        if (!userId) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    userId = userData.id;
                } catch {
                    // continue
                }
            }
        }

        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        setIsDeleting(true);
        try {
            await deleteUserAccount(userId);
            alert(t('data.delete_success'));
            navigate('/login');
        } catch (error) {
            console.error('Delete error:', error);
            alert(`${t('data.delete_error')}: ${(error as Error).message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <PageContainer theme={theme}>
            <PageHeader>
                <PageTitle>⚙️ {t('settings.title')}</PageTitle>
                <PageSubtitle>
                    {t('settings.subtitle')}
                </PageSubtitle>
            </PageHeader>

            <SettingsGrid theme={theme}>
                {/* Theme Settings */}
                <SettingCard theme={theme}>
                    <h3>🌓 {t('settings.appearance')}</h3>
                    <p>Choose between light and dark mode for comfortable viewing at any time of day.</p>

                    <RadioGroup>
                        <RadioButton theme={theme}>
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={theme.mode === 'light'}
                                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            />
                            <span>☀️ {t('settings.light_mode')}</span>
                        </RadioButton>
                        <RadioButton theme={theme}>
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={theme.mode === 'dark'}
                                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            />
                            <span>🌙 {t('settings.dark_mode')}</span>
                        </RadioButton>
                    </RadioGroup>
                </SettingCard>

                {/* Notification Settings */}
                <SettingCard theme={theme}>
                    <h3>🔔 {t('settings.notifications')}</h3>
                    <p>Manage how you receive updates about destinations and recommendations.</p>

                    <ControlRow>
                        <div style={{flex: 1}}>
                            <span style={{color: theme.colors.text, fontWeight: 500}}>{t('settings.push_notifications')}</span>
                            <p style={{fontSize: '0.85rem', margin: '0.25rem 0 0 0'}}>Get notified about new
                                recommendations</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.notifications}
                            onChange={(e) => handleToggle('notifications', e.target.checked)}
                        />
                    </ControlRow>

                    <ControlRow>
                        <div style={{flex: 1}}>
                            <span style={{color: theme.colors.text, fontWeight: 500}}>{t('settings.email_notifications')}</span>
                            <p style={{fontSize: '0.85rem', margin: '0.25rem 0 0 0'}}>Weekly eco-destination updates</p>
                        </div>
                        <ToggleSwitch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
                        />
                    </ControlRow>
                </SettingCard>

                {/* Language Settings */}
                <SettingCard theme={theme}>
                    <h3>🌐 {t('settings.language_localization')}</h3>
                    <p>{t('settings.select_language')}</p>

                    <div style={{marginBottom: '1rem'}}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: theme.colors.text
                        }}>
                            {t('general.language')}
                        </label>
                        <Select
                            value={language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            theme={theme}
                        >
                            <option value="en">English</option>
                            <option value="de">Deutsch (German)</option>
                            <option value="fr">Français (French)</option>
                            <option value="es">Español (Spanish)</option>
                            <option value="it">Italiano (Italian)</option>
                        </Select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: theme.colors.text
                        }}>
                            📍 {t('settings.interested_regions')}
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., Germany, Bavaria, Berlin"
                            value={settings.seoLocation}
                            onChange={(e) => handleChange('seoLocation', e.target.value)}
                            theme={theme}
                        />
                        <p style={{fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '0.5rem'}}>
                            Helps us recommend eco-friendly attractions nearby
                        </p>
                    </div>
                </SettingCard>

                {/* Travel Preferences */}
                <SettingCard theme={theme}>
                    <h3>✈️ Travel Preferences</h3>
                    <p>Customize recommendations based on your travel style and values.</p>

                    <div style={{marginBottom: '1rem'}}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: theme.colors.text
                        }}>
                            Travel Purpose
                        </label>
                        <Select
                            value={settings.visitingReason}
                            onChange={(e) => handleChange('visitingReason', e.target.value)}
                            theme={theme}
                        >
                            <option value="leisure">Leisure/Vacation</option>
                            <option value="business">Business</option>
                            <option value="adventure">Adventure</option>
                            <option value="cultural">Cultural</option>
                            <option value="relaxation">Relaxation</option>
                            <option value="eco-tourism">Eco-Tourism</option>
                        </Select>
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: theme.colors.text
                        }}>
                            Sustainability Priority
                        </label>
                        <Select
                            value={settings.sustainabilityLevel}
                            onChange={(e) => handleChange('sustainabilityLevel', e.target.value)}
                            theme={theme}
                        >
                            <option value="high">Very Important 🌿🌿🌿</option>
                            <option value="medium-high">Important 🌿🌿</option>
                            <option value="medium">Somewhat Important 🌿</option>
                            <option value="low">Not a Priority</option>
                        </Select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: theme.colors.text
                        }}>
                            Budget Range
                        </label>
                        <Select
                            value={settings.budgetRange}
                            onChange={(e) => handleChange('budgetRange', e.target.value)}
                            theme={theme}
                        >
                            <option value="budget">Budget (€ - €€)</option>
                            <option value="medium">Medium (€€ - €€€)</option>
                            <option value="luxury">Luxury (€€€ - €€€€)</option>
                            <option value="flexible">Flexible</option>
                        </Select>
                    </div>
                </SettingCard>

                {/* About this Service */}
                <SettingCard theme={theme}>
                    <h3>ℹ️ About EcoRoute AI</h3>
                    <p>
                        EcoRoute AI is your smart guide to sustainable travel. We use advanced AI algorithms to match
                        you with eco-friendly
                        destinations that align with your values and preferences.
                    </p>

                    <div style={{
                        fontSize: '0.9rem',
                        color: theme.colors.textSecondary,
                        marginBottom: '1rem',
                        lineHeight: '1.6'
                    }}>
                        <strong style={{
                            display: 'block',
                            color: theme.colors.text,
                            marginBottom: '0.5rem'
                        }}>Features:</strong>
                        ✅ Personalized AI recommendations<br/>
                        ✅ Sustainability scoring for destinations<br/>
                        ✅ CO₂ footprint tracking<br/>
                        ✅ Local eco-tourism guides<br/>
                        ✅ Real-time destination data
                    </div>

                    <Button onClick={() => window.open('https://ecoroute.ai', '_blank')} variant="secondary">
                        📖 Learn More
                    </Button>
                </SettingCard>

                {/* Privacy & Data */}
                <SettingCard theme={theme}>
                    <h3>🔒 {t('settings.privacy_data')}</h3>
                    <p>
                        We take your privacy seriously. Your data is encrypted and never shared with third parties
                        without your consent.
                    </p>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem'}}>
                        <Button
                            onClick={handleExportData}
                            variant="outline"
                            disabled={isExporting}
                        >
                            {isExporting ? '⏳ Exporting...' : `📥 ${t('settings.export_data')}`}
                        </Button>
                        <Button
                            onClick={() => setShowDeleteConfirm(true)}
                            variant="outline"
                            disabled={isDeleting}
                            style={{color: '#dc2626'}}
                        >
                            {isDeleting ? '⏳ Deleting...' : `🗑️ ${t('settings.delete_account')}`}
                        </Button>
                    </div>

                    {showDeleteConfirm && (
                        <div style={{
                            padding: '1rem',
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            marginTop: '1rem'
                        }}>
                            <p style={{
                                color: '#991b1b',
                                marginBottom: '1rem',
                                fontWeight: 600
                            }}>
                                ⚠️ {t('data.delete_confirm')}
                            </p>
                            <div style={{display: 'flex', gap: '0.75rem'}}>
                                <Button
                                    onClick={handleDeleteAccount}
                                    variant="primary"
                                    disabled={isDeleting}
                                    style={{background: '#dc2626'}}
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </Button>
                                <Button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    <InfoMessage>
                        <strong>Data Usage:</strong> Your travel preferences help us provide better recommendations
                        while respecting your privacy.
                    </InfoMessage>
                </SettingCard>
            </SettingsGrid>

            <ButtonGroup style={{marginTop: '2rem'}}>
                <Button onClick={handleSave} variant="primary">
                    💾 {t('settings.save_all')}
                </Button>
                <Button
                    onClick={() => window.location.reload()}
                    variant="secondary"
                >
                    🔄 {t('settings.reset')}
                </Button>
            </ButtonGroup>

            {settings.savedMessage && (
                <InfoMessage style={{marginTop: '1rem', marginBottom: 0}}>
                    ✅ Settings saved successfully!
                </InfoMessage>
            )}
        </PageContainer>
    );
}
