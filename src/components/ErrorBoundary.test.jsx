// src/components/ErrorBoundary.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// 1. Create a dummy component that intentionally throws an error
const ProblemChild = () => {
    throw new Error('Test Error: This is intentional!');
};

describe('ErrorBoundary Component', () => {
    it('catches React rendering errors and displays the fallback UI', () => {
        // Suppress console.error in the terminal just for this test so it looks clean
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // 2. Render the bad component inside our boundary
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        // 3. Check if our ErrorBoundary caught it and showed our custom error message
        expect(screen.getByText(/Application Error/i)).toBeInTheDocument();
        expect(screen.getByText(/We encountered an unexpected issue/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reload Fit-Track/i })).toBeInTheDocument();

        // Restore the console
        consoleSpy.mockRestore();
    });
});