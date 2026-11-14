import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const clipboardWriteText = vi.fn();

beforeEach(() => {
  window.history.replaceState({}, '', '/daily-ponderance');
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: clipboardWriteText } });
  clipboardWriteText.mockReset();
  clipboardWriteText.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('app journeys', () => {
  it('opens each page, navigates between them, and follows browser back', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'YOU CHOOSE THE OUTCOME' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Preamble' }));
    expect(screen.getByRole('heading', { name: 'Preamble' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Items to paste in chat' }));
    expect(screen.getByRole('heading', { name: 'Items to paste in chat' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Daily ponderance' }));
    expect(screen.getByRole('heading', { name: 'YOU CHOOSE THE OUTCOME' })).toBeInTheDocument();

    window.history.back();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Items to paste in chat' })).toBeInTheDocument());
  });

  it('chooses a reading date from the calendar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(document.querySelector('.date-picker-trigger') as HTMLButtonElement);
    expect(screen.getByRole('dialog', { name: 'Choose a date' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '1', exact: true }));
    expect(screen.getByText(/1st$/)).toBeInTheDocument();
  });

  it('expands direct messages and copies a message with feedback', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('link', { name: 'Items to paste in chat' }));
    const toggle = screen.getByRole('button', { name: 'Show direct messages' });
    await user.click(toggle);
    expect(screen.getAllByRole('button', { name: /Copy message:/ }).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: /Copy message:/ })[0]);
    expect(await screen.findByText('Message copied to clipboard.')).toBeInTheDocument();
  });

  it('shows copy failure feedback when clipboard access is denied', async () => {
    clipboardWriteText.mockRejectedValue(new Error('denied'));
    render(<App />);
    await act(async () => {
      fireEvent.click(document.querySelector('.reading-copy-button') as HTMLButtonElement);
      await Promise.resolve();
    });
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
  });

  it('opens and closes the meeting reminder', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T17:49:59Z'));
    window.localStorage.removeItem('last-five-alert-date');
    render(<App />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
