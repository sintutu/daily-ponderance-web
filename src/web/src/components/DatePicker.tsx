import React, { useEffect, useRef, useState } from 'react';

interface DatePickerProps {
  defaultDate: string;
  onDateChange: (newDate: string) => void;
}

const parseDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DatePicker: React.FC<DatePickerProps> = ({ defaultDate, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(() => {
    const initial = parseDate(defaultDate);
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(defaultDate);
    const date = parseDate(defaultDate);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [defaultDate]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const chosen = parseDate(selectedDate);
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const selectDay = (day: number) => {
    const nextDate = toIsoDate(new Date(month.getFullYear(), month.getMonth(), day));
    setSelectedDate(nextDate);
    onDateChange(nextDate);
    setVisible(false);
  };

  const moveMonth = (amount: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <div className="date-picker" ref={pickerRef}>
      <button
        type="button"
        className="date-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={visible}
        onClick={() => setVisible((open) => !open)}
      >
        <svg className="calendar-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
        <span>{chosen.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <svg className="calendar-small-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <path d="M8 3v4m8-4v4M4 10h16" />
        </svg>
      </button>

      {visible && (
        <div className="calendar-popover" role="dialog" aria-label="Choose a date">
          <div className="calendar-heading">
            <button type="button" className="calendar-nav" aria-label="Previous month" onClick={() => moveMonth(-1)}>‹</button>
            <strong>{monthLabel}</strong>
            <button type="button" className="calendar-nav" aria-label="Next month" onClick={() => moveMonth(1)}>›</button>
          </div>
          <div className="calendar-grid calendar-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              if (day === null) return <span className="calendar-empty" key={`empty-${index}`} />;
              const isSelected = chosen.getFullYear() === month.getFullYear()
                && chosen.getMonth() === month.getMonth() && chosen.getDate() === day;
              return (
                <button
                  type="button"
                  key={day}
                  className={isSelected ? 'calendar-day selected' : 'calendar-day'}
                  aria-pressed={isSelected}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button type="button" className="calendar-today" onClick={() => {
            const today = new Date();
            setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            selectDay(today.getDate());
          }}>Today</button>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
