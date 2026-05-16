import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import styled from 'styled-components';

const RegisterContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
`;

const RegisterCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 2rem;
    color: #2d3748;
    font-size: 2rem;
    font-weight: 700;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-weight: 600;
    color: #4a5568;
    font-size: 0.9rem;
`;

const Input = styled.input`
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }

    &::placeholder {
        color: #a0aec0;
    }
`;

const TextArea = styled.textarea`
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    resize: vertical;
    min-height: 80px;

    &:focus {
        outline: none;
        border-color: #48bb78;
        box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }

    &::placeholder {
        color: #a0aec0;
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const LinkText = styled.p`
    text-align: center;
    margin-top: 1.5rem;
    color: #718096;

    a {
        color: #48bb78;
        text-decoration: none;
        font-weight: 600;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const ErrorMessage = styled.div`
    background: #fed7d7;
    color: #c53030;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #feb2b2;
    font-size: 0.9rem;
    text-align: center;
`;

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [preferences, setPreferences] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {register} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(email, username, password, preferences);
            navigate('/');
        } catch {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterContainer>
            <RegisterCard>
                <Title>Join EcoRoute</Title>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="preferences">Travel Preferences (Optional)</Label>
                        <TextArea
                            id="preferences"
                            placeholder="Tell us about your travel preferences (e.g., eco-friendly, adventure, culture, relaxation)"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                        />
                    </FormGroup>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </Form>

                <LinkText>
                    Already have an account? <Link to="/login">Sign in</Link>
                </LinkText>
            </RegisterCard>
        </RegisterContainer>
    );
}
