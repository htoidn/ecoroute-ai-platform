import AddUser from '../components/AddUser';
import styled from 'styled-components';

const PageContainer = styled.div`
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #2d3748, #4a5568);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  p {
    font-size: 1.1rem;
    color: #718096;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

export default function AddUserPage() {
  return (
    <PageContainer>
      <Header>
        <h1>User Management</h1>
        <p>
          Create new user accounts for the EcoRoute AI platform.
          Set up user preferences and access levels.
        </p>
      </Header>

      <AddUser />
    </PageContainer>
  );
}
