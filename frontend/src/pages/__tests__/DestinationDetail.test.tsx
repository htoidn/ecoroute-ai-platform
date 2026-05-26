import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from '../../contexts/NotificationContext';

// mock theme context to avoid accessing localStorage in ThemeProvider
vi.mock('../../contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: {
            mode: 'light',
            colors: {
                bg: '#f5f7fa', bgSecondary: '#ffffff', text: '#1a202c', textSecondary: '#4a5568', primary: '#48bb78', primaryLight: '#9ae6b4', accent: '#667eea', border: '#e2e8f0', shadow: 'rgba(0,0,0,0.1)', cardBg: '#ffffff'
            }
        },
        toggleTheme: () => {},
        setMode: () => {}
    })
}));

// mock the API module used by the component
vi.mock('../../services/api', () => ({
    getDestinationById: vi.fn(),
    getAllRecommendations: vi.fn(),
    getAllDestinations: vi.fn(),
}));

import { getDestinationById, getAllRecommendations, getAllDestinations } from '../../services/api';
import DestinationDetail from '../DestinationDetail';

// ensure localStorage exists in the test environment
if (typeof globalThis.localStorage === 'undefined') {
    // simple in-memory mock (avoid using `this` to keep TypeScript happy)
    const _store: Record<string,string> = {};
    const mockStorage = {
        getItem(key: string) { return _store[key] ?? null; },
        setItem(key: string, value: string) { _store[key] = String(value); },
        removeItem(key: string) { delete _store[key]; }
    } as unknown as Storage;
    globalThis.localStorage = mockStorage;
} else {
    // ensure methods exist
    try {
        if (typeof (globalThis.localStorage as any).getItem !== 'function') (globalThis.localStorage as any).getItem = () => null;
        if (typeof (globalThis.localStorage as any).setItem !== 'function') (globalThis.localStorage as any).setItem = () => {};
        if (typeof (globalThis.localStorage as any).removeItem !== 'function') (globalThis.localStorage as any).removeItem = () => {};
    } catch {
        // ignore
    }
}

const wrap = (ui: React.ReactElement, path = '/destination/1') => render(
    <MemoryRouter initialEntries={[path]}>
        <NotificationProvider>
            <Routes>
                <Route path="/destination/:id" element={ui} />
            </Routes>
        </NotificationProvider>
    </MemoryRouter>
);

describe('DestinationDetail', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders related destinations and top5', async () => {
        const dest = {
            id: 1,
            name: 'Test City',
            country: 'Utopia',
            description: 'Nice place',
            sustainabilityScore: 88,
            costIndex: 50,
            crowdIndex: 30,
            co2PerTrip: 20,
            publicTransportScore: 80,
            avgTemp: 20,
            bestSeason: 'Summer',
            tags: 'beach,city'
        };

        const allDests = [
            dest,
            { id: 2, name: 'Beach Town', country: 'Utopia', sustainabilityScore: 70, tags: 'beach,resort', description: '', costIndex: 40, crowdIndex: 20, co2PerTrip: 30, publicTransportScore: 60, avgTemp: 25, bestSeason: 'Summer' },
            { id: 3, name: 'Mountain Village', country: 'Other', sustainabilityScore: 90, tags: 'mountain', description: '', costIndex: 60, crowdIndex: 10, co2PerTrip: 10, publicTransportScore: 40, avgTemp: 12, bestSeason: 'Winter' },
            { id: 4, name: 'Old Town', country: 'Utopia', sustainabilityScore: 82, tags: 'city,history', description: '', costIndex: 70, crowdIndex: 40, co2PerTrip: 50, publicTransportScore: 90, avgTemp: 18, bestSeason: 'Spring' }
        ];

        const recs = [
            { id: 1, userId: 10, destinationId: 2, aiScore: 95, reason: 'Great' },
            { id: 2, userId: 11, destinationId: 4, aiScore: 90, reason: 'Nice' },
            { id: 3, userId: 12, destinationId: 3, aiScore: 85, reason: 'Good' },
        ];

        (getDestinationById as any).mockResolvedValue({ data: dest });
        (getAllRecommendations as any).mockResolvedValue({ data: recs });
        (getAllDestinations as any).mockResolvedValue({ data: allDests });

        wrap(<DestinationDetail />);

        // wait for destination title
        await waitFor(() => expect(screen.getByText('Test City')).toBeDefined());

        // related header
        expect(screen.getByText(/Related Destinations/i)).toBeDefined();

        // top5 header
        expect(screen.getByText(/Top 5 Destinations/i)).toBeDefined();

        // related item - Beach Town should appear (shares 'beach' tag)
        const beachItems = screen.getAllByText('Beach Town');
        expect(beachItems.length).toBeGreaterThan(0);
    });
});

