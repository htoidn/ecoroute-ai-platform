import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 25%, #3d7a4d 50%, #2d5a3d 75%, #1a472a 100%);
    background-attachment: fixed;
    padding: 2rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(72, 187, 120, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        top: -100px;
        left: -100px;
        animation: float 6s ease-in-out infinite;
    }

    &::after {
        content: '';
        position: absolute;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(56, 161, 105, 0.12) 0%, transparent 70%);
        border-radius: 50%;
        bottom: -50px;
        right: -50px;
        animation: float 8s ease-in-out infinite reverse;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(20px); }
    }
`;

const LoginCard = styled.div`
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(15px);
    border-radius: 24px;
    padding: 3.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), 0 0 40px rgba(72, 187, 120, 0.1);
    width: 100%;
    max-width: 420px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 10;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 35px 60px rgba(0, 0, 0, 0.25), 0 0 50px rgba(72, 187, 120, 0.15);
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Logo = styled.div`
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #1a472a 0%, #48bb78 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.2rem;
    font-weight: 800;
`;

const Subtitle = styled.p`
    text-align: center;
    color: #718096;
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const Label = styled.label`
    font-weight: 700;
    color: #1a472a;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Input = styled.input`
    padding: 1rem 1.2rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.95);
    color: #1a202c;
    font-weight: 500;

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 4px rgba(72, 187, 120, 0.15);
        background: rgba(255, 255, 255, 1);
    }

    &::placeholder {
        color: #cbd5e0;
    }
`;

const Button = styled.button`
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 8px 16px rgba(72, 187, 120, 0.3);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 24px rgba(72, 187, 120, 0.4);
    }

    &:active {
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const SignUpLink = styled.div`
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
`;

const LinkText = styled.p`
    text-align: center;
    color: #718096;
    font-size: 0.95rem;
    margin: 0;

    a {
        color: #48bb78;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            background: #48bb78;
            bottom: -2px;
            left: 0;
            transition: width 0.3s ease;
        }

        &:hover {
            &::after {
                width: 100%;
            }
        }
    }
`;

const ErrorMessage = styled.div`
    background: linear-gradient(135deg, #fed7d7 0%, #fdc2c2 100%);
    color: #c53030;
    padding: 1rem;
    border-radius: 12px;
    border: 2px solid #fc8181;
    font-size: 0.95rem;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(197, 48, 48, 0.15);
`;

const Features = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
`;

const Feature = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #4a5568;

    .icon {
        font-size: 1.3rem;
    }
`;

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // login now returns the logged-in user object
            const loggedInUser = await login(username, password);
            if (loggedInUser && loggedInUser.role === 'admin') {
                navigate('/recommendations');
            } else {
                navigate('/');
            }
        } catch {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <Header>
                    <Logo>🌍</Logo>
                    <Title>EcoRoute</Title>
                    <Subtitle>Explore the world sustainably • AI-powered eco-tourism</Subtitle>
                </Header>

                <Features>
                    <Feature>
                        <span className="icon">♻️</span>
                        <span>Eco-Friendly Routes</span>
                    </Feature>
                    <Feature>
                        <span className="icon">🤖</span>
                        <span>AI Recommendations</span>
                    </Feature>
                    <Feature>
                        <span className="icon">🌱</span>
                        <span>Sustainable Travel</span>
                    </Feature>
                    <Feature>
                        <span className="icon">🗺️</span>
                        <span>Global Destinations</span>
                    </Feature>
                </Features>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="username">
                            👤 Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">
                            🔐 Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>

                    {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}

                    <Button type="submit" disabled={loading}>
                        {loading ? '🔄 Signing In...' : '🚀 Start Your Journey'}
                    </Button>
                </Form>

                <SignUpLink>
                    <LinkText>
                        New to EcoRoute? <Link to="/register">Create an account</Link>
                    </LinkText>
                </SignUpLink>
            </LoginCard>
        </LoginContainer>
    );
}
