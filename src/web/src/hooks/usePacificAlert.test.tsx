import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { usePacificAlert } from './usePacificAlert';

const Harness = ({ onAlert }: { onAlert: () => void }) => {
  usePacificAlert(onAlert);
  return null;
};

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

describe('Pacific meeting reminder', () => {
  it('fires at 9:50 a.m. Pacific and records the date once', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T17:49:59Z'));
    const onAlert = vi.fn();
    render(<Harness onAlert={onAlert} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onAlert).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem('last-five-alert-date')).toBe('2026-11-15');
  });

  it('does not repeat after the reminder has fired that Pacific day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T17:49:59Z'));
    const onAlert = vi.fn();
    render(<Harness onAlert={onAlert} />);
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(onAlert).toHaveBeenCalledTimes(1);
  });

  it('waits while the page is hidden and checks again when it becomes visible', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T17:49:59Z'));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    const onAlert = vi.fn();
    render(<Harness onAlert={onAlert} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onAlert).not.toHaveBeenCalled();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(onAlert).toHaveBeenCalledTimes(1);
  });
});
