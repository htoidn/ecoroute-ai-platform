import Sidebar from '../layout/Sidebar';
import Home from '../pages/Home';

import {
    Container,
    SidebarWrapper,
    MainContent
} from '../styles/LayoutStyles';

export default function App() {
    return (
        <Container>
            <SidebarWrapper>
                <Sidebar />
            </SidebarWrapper>

            <MainContent>
                <Home />
            </MainContent>
        </Container>
    );
}
