import React, {createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

type Toast = { id: number; message: string; type?: 'info' | 'error' | 'success' };

interface NotificationContextType {
    showToast: (message: string, type?: Toast['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
    return ctx;
};

const Container = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
`;

const ToastItem = styled.div<{type?: string}>`
    background: ${props => (props.type === 'error' ? '#fecaca' : props.type === 'success' ? '#bbf7d0' : '#e6edf3')};
    color: ${props => (props.type === 'error' ? '#9b2c2c' : '#0f172a')};
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(2,6,23,0.08);
    min-width: 220px;
    font-weight: 600;
`;

export const NotificationProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: Toast['type'] = 'info') => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const t = {id, message, type};
        setToasts(prev => [t, ...prev]);
        setTimeout(() => {
            setToasts(prev => prev.filter(x => x.id !== id));
        }, 4500);
    };

    return (
        <NotificationContext.Provider value={{showToast}}>
            {children}
            <Container>
                {toasts.map(t => (
                    <ToastItem key={t.id} type={t.type}>
                        {t.message}
                    </ToastItem>
                ))}
            </Container>
        </NotificationContext.Provider>
    );
};

export default NotificationContext;

