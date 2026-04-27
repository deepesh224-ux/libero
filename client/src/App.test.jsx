import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
    it('renders LIBERO brand', () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
            })
        );

        render(<BrowserRouter><App /></BrowserRouter>);
        const elements = screen.getAllByText(/^LIBERO$/i);
        expect(elements[0]).toBeInTheDocument();
    });
});