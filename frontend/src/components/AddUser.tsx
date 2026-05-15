import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  position: relative;
  z-index: 1;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: white;

  .p-card-header {
    background: linear-gradient(135deg, #48bb78, #38a169);
    color: white;
    border-radius: 16px 16px 0 0;
    padding: 1.5rem;

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .p-card-body {
    padding: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4a5568;
  }

  .p-inputtext,
  .p-password-input,
  .p-dropdown {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: #48bb78;
      box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    }
  }

  .p-password {
    width: 100%;

    .p-password-toggle {
      color: #48bb78;
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #38a169, #2f855a);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled(Message)`
  margin-top: 1rem;
  border-radius: 8px;

  .p-message-icon {
    color: #38a169;
  }
`;

const ErrorMessage = styled(Message)`
  margin-top: 1rem;
  border-radius: 8px;
  border-color: #e53e3e;
  background: #fed7d7;
  color: #c53030;

  .p-message-icon {
    color: #c53030;
  }
`;

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  preferred_budget: number;
  preferred_climate: string;
}

export default function AddUser() {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    preferred_budget: 0,
    preferred_climate: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' }
  ];

  const climateOptions = [
    { label: 'Cool', value: 'cool' },
    { label: 'Warm', value: 'warm' },
    { label: 'Mild', value: 'mild' },
    { label: 'Cold', value: 'cold' },
    { label: 'Hot', value: 'hot' }
  ];

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'USER',
        preferred_budget: 0,
        preferred_climate: ''
      });
    } catch {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.username && formData.email && formData.password;

  return (
    <FormContainer>
      <StyledCard>
        <div className="p-card-header">
          <h2>Add New User</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-card-body">
            <FormGroup>
              <label htmlFor="username">Username *</label>
              <InputText
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="email">Email *</label>
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="password">Password *</label>
              <Password
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
                toggleMask
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="role">Role</label>
              <Dropdown
                id="role"
                value={formData.role}
                options={roleOptions}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Select role"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="budget">Preferred Budget</label>
              <InputText
                id="budget"
                type="number"
                value={formData.preferred_budget.toString()}
                onChange={(e) => handleInputChange('preferred_budget', parseFloat(e.target.value) || 0)}
                placeholder="Enter preferred budget"
                min="0"
                step="0.01"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="climate">Preferred Climate</label>
              <Dropdown
                id="climate"
                value={formData.preferred_climate}
                options={climateOptions}
                onChange={(e) => handleInputChange('preferred_climate', e.target.value)}
                placeholder="Select preferred climate"
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              label={loading ? 'Creating User...' : 'Create User'}
              disabled={!isFormValid || loading}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-plus'}
            />

            {success && (
              <SuccessMessage
                severity="success"
                text="User created successfully!"
              />
            )}

            {error && (
              <ErrorMessage
                severity="error"
                text={error}
              />
            )}
          </div>
        </form>
      </StyledCard>
    </FormContainer>
  );
}
