import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 25%, #1a472a 50%, #38a169 75%, #1a472a 100%);
    background-attachment: fixed;
    padding: 2rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(72, 187, 120, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        top: -250px;
        left: -250px;
        animation: float 8s ease-in-out infinite;
    }

    &::after {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(161, 216, 181, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        bottom: -200px;
        right: -200px;
        animation: float 10s ease-in-out infinite reverse;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(30px) scale(1.05); }
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
`;

const LoginCard = styled.div`
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3.5rem;
    box-shadow: 
        0 25px 50px rgba(26, 71, 42, 0.3),
        0 0 0 1px rgba(72, 187, 120, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    width: 100%;
    max-width: 480px;
    border: 2px solid rgba(72, 187, 120, 0.3);
    position: relative;
    z-index: 10;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateY(0);

    &:hover {
        transform: translateY(-12px);
        box-shadow: 
            0 35px 70px rgba(26, 71, 42, 0.35),
            0 0 0 1px rgba(72, 187, 120, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border-color: rgba(72, 187, 120, 0.5);
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Logo = styled.div`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: bounce 3s ease-in-out infinite;
    display: inline-block;

    @keyframes bounce {
        0%, 100% { 
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
        }
        25% { 
            transform: translateY(-15px) rotateZ(5deg);
            opacity: 0.9;
        }
        50% { 
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
        }
        75% { 
            transform: translateY(-10px) rotateZ(-5deg);
            opacity: 0.9;
        }
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, #1a472a 0%, #38a169 50%, #48bb78 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.8rem;
    font-weight: 900;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 10px rgba(56, 161, 105, 0.1);
`;

const Subtitle = styled.p`
    text-align: center;
    color: #2d5a3d;
    font-size: 1rem;
    margin: 0;
    line-height: 1.6;
    font-weight: 600;
    background: linear-gradient(135deg, #4a5568 0%, #2d5a3d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    color: #2d5a3d;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Input = styled.input`
    padding: 1.1rem 1.3rem;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: rgba(255, 255, 255, 0.98);
    color: #1a202c;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &:focus {
        outline: none;
        border-color: #38a169;
        box-shadow: 0 0 0 4px rgba(56, 161, 105, 0.2), 0 4px 12px rgba(56, 161, 105, 0.15);
        background: rgba(255, 255, 255, 1);
        transform: translateY(-2px);
    }

    &::placeholder {
        color: #cbd5e0;
        font-weight: 500;
    }
`;

const Button = styled.button`
    padding: 1.1rem 1.8rem;
    background: linear-gradient(135deg, #38a169 0%, #2d7a4f 50%, #1a472a 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-top: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 10px 25px rgba(56, 161, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 35px rgba(56, 161, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        
        &::before {
            left: 100%;
        }
    }

    &:active {
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const SignUpLink = styled.div`
    text-align: center;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 2px solid rgba(72, 187, 120, 0.15);
`;

const LinkText = styled.p`
    text-align: center;
    color: #2d5a3d;
    font-size: 0.95rem;
    margin: 0;
    font-weight: 600;

    a {
        color: #38a169;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        background: linear-gradient(135deg, #38a169, #48bb78);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #38a169, #48bb78);
            bottom: -4px;
            left: 0;
            transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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
    padding: 1.1rem;
    border-radius: 14px;
    border: 2px solid #fc8181;
    font-size: 0.95rem;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(197, 48, 48, 0.2);
    animation: slideDown 0.3s ease;

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const Features = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 2.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 2px solid rgba(72, 187, 120, 0.15);
`;

const Feature = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
    color: #2d5a3d;
    font-weight: 600;
    padding: 0.8rem;
    background: rgba(72, 187, 120, 0.08);
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(72, 187, 120, 0.15);

    &:hover {
        background: rgba(72, 187, 120, 0.15);
        transform: translateX(4px);
        border-color: rgba(72, 187, 120, 0.3);
    }

    .icon {
        font-size: 1.6rem;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
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
