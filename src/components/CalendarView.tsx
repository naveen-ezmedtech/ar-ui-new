import { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCallsByDate } from '../services/api';
import type { CalendarCall } from '../types';
import { formatDateKey, formatTime, groupCallsByLocalDate } from '../utils/timezone';

interface CalendarViewProps {
  onDateSelect?: (date: string, calls: CalendarCall[]) => void;
}

export const CalendarView = ({ onDateSelect }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateCalls, setSelectedDateCalls] = useState<CalendarCall[]>([]);
  const [loadingSelectedDate, setLoadingSelectedDate] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);


  // Load calls for a specific date
  const loadTodaysCalls = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setLoadingSelectedDate(true);

    try {
      const dateKey = formatDateKey(date);
      // Fetch calls for the selected date
      // Note: Backend returns UTC-based grouping, so we need to fetch a wider range
      // to ensure we get all calls that might fall on the selected local date.
      // Fetch ±1 day to cover timezone differences (max offset is ±14 hours)
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const response = await getCallsByDate(
        formatDateKey(prevDate),
        formatDateKey(nextDate)
      );
      
      // Group calls by local date (convert from UTC-based grouping)
      const localCallsByDate = groupCallsByLocalDate(response.calls_by_date || {});
      const calls = localCallsByDate[dateKey] || [];
      setSelectedDateCalls(calls);

      if (onDateSelect) {
        onDateSelect(dateKey, calls);
      }
    } catch (error) {
      console.error('Failed to load calls for date:', error);
      setSelectedDateCalls([]);
    } finally {
      setLoadingSelectedDate(false);
    }
  }, [onDateSelect]);

  // Load highlighted dates for the current month view and auto-select today (only once on mount)
  useEffect(() => {
    let isMounted = true;
    
    const loadHighlightedDates = async () => {
      try {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const response = await getCallsByDate(
          formatDateKey(start),
          formatDateKey(end)
        );

        if (!isMounted) return;

        // Group calls by local date (convert from UTC-based grouping)
        const localCallsByDate = groupCallsByLocalDate(response.calls_by_date || {});

        // Convert local date keys to Date objects for highlighting
        const dates: Date[] = [];
        Object.keys(localCallsByDate).forEach((dateKey) => {
          const [year, month, day] = dateKey.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            dates.push(date);
          }
        });
        setHighlightedDates(dates);
        
        // Auto-select today's date and load today's calls
        loadTodaysCalls(today);
      } catch (error) {
        console.error('Failed to load highlighted dates:', error);
        // Still auto-select today even if there's an error
        const today = new Date();
        loadTodaysCalls(today);
      }
    };

    loadHighlightedDates();
    
    return () => {
      isMounted = false;
    };
  }, [loadTodaysCalls]);

  const handleDateChange = async (date: Date | null) => {
    if (!date) {
      setSelectedDate(null);
      setSelectedDateCalls([]);
      return;
    }

    await loadTodaysCalls(date);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };


  // Custom day class name to highlight dates with calls
  const dayClassName = (date: Date) => {
    const dateKey = formatDateKey(date);
    const hasCalls = highlightedDates.some(
      (d) => formatDateKey(d) === dateKey
    );
    return hasCalls ? 'has-calls' : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Invoice Calls</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* DatePicker Section */}
        <div className="flex-shrink-0">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            calendarClassName="!border-0 !shadow-none"
            dayClassName={dayClassName}
            highlightDates={highlightedDates}
            className="w-full"
            calendarStartDay={0}
          />
          <style>{`
            .react-datepicker {
              font-family: inherit;
              border: none;
              box-shadow: none;
              background: white;
            }
            .react-datepicker__header {
              background-color: white;
              border-bottom: 1px solid #e5e7eb;
              padding-top: 0.75rem;
              padding-bottom: 0.5rem;
              position: relative;
            }
            .react-datepicker__current-month {
              color: #111827;
              font-weight: 600;
              padding: 0.5rem 0;
              font-size: 1rem;
              margin-bottom: 0.5rem;
            }
            .react-datepicker__day-name {
              color: #6b7280;
              font-weight: 600;
              font-size: 0.875rem;
              width: 2.5rem;
              line-height: 2.5rem;
            }
            .react-datepicker__day {
              border-radius: 0;
              margin: 0;
              width: 2.5rem;
              height: 2.5rem;
              line-height: 2.5rem;
              border: 1px solid #f3f4f6;
              color: #111827;
            }
            .react-datepicker__day:hover {
              background-color: #f9fafb;
              border-radius: 0;
            }
            .react-datepicker__day--selected,
            .react-datepicker__day--keyboard-selected {
              background-color: #6366f1;
              color: white;
              border-radius: 0;
              border-color: #6366f1;
            }
            .react-datepicker__day--selected:hover,
            .react-datepicker__day--keyboard-selected:hover {
              background-color: #4f46e5;
            }
            .react-datepicker__day--today {
              background-color: white;
              color: #111827;
              font-weight: 600;
            }
            .react-datepicker__day.has-calls {
              position: relative;
            }
            .react-datepicker__day.has-calls::after {
              content: '';
              position: absolute;
              top: 4px;
              right: 4px;
              width: 6px;
              height: 6px;
              background-color: #3b82f6;
              border-radius: 50%;
            }
            .react-datepicker__day--highlighted {
              background-color: white;
              color: #111827;
            }
            .react-datepicker__day--highlighted:hover {
              background-color: #f9fafb;
            }
            .react-datepicker__navigation {
              top: 0.0001rem;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 6px;
              background-color: #f3f4f6;
              border: 1px solid #d1d5db;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            }
            .react-datepicker__navigation:hover {
              background-color: #e5e7eb;
              border-color: #9ca3af;
            }
            .react-datepicker__navigation--previous {
              left: 0.5rem;
            }
            .react-datepicker__navigation--next {
              right: 0.5rem;
            }
            .react-datepicker__navigation-icon {
              position: relative;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .react-datepicker__navigation-icon::before {
              content: '';
              position: absolute;
              width: 8px;
              height: 8px;
              border-style: solid;
              border-width: 2px 2px 0 0;
              border-color: #4b5563;
              display: block;
            }
            .react-datepicker__navigation--previous .react-datepicker__navigation-icon::before {
              transform: rotate(-135deg);
              left: 50%;
              top: 50%;
              margin-left: -2px;
              margin-top: -4px;
            }
            .react-datepicker__navigation--next .react-datepicker__navigation-icon::before {
              transform: rotate(45deg);
              left: 50%;
              top: 50%;
              margin-left: -2px;
              margin-top: -4px;
            }
            .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
              border-color: #1f2937;
            }
            .react-datepicker__month {
              margin: 0.5rem;
            }
            .react-datepicker__week {
              display: flex;
            }
          `}</style>
        </div>

        {/* Invoice List Section */}
        <div className="flex-1">
          {selectedDate ? (
            <div>
              {loadingSelectedDate ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                </div>
              ) : selectedDateCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No invoice calls on this date
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {selectedDateCalls.map((call, index) => {
                      // Filter out "value_or_empty" - only show invoice if it has a valid value
                      const invoiceNumber = call.invoice_number && call.invoice_number !== 'value_or_empty' && call.invoice_number.trim() !== ''
                        ? call.invoice_number 
                        : null;
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:border-teal-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {`${call.patient_first_name || ''} ${call.patient_last_name || ''}`.trim() || 'Unknown'}
                              </p>
                              {invoiceNumber && (
                                <>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600 truncate">
                                {invoiceNumber}
                              </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatTime(call.called_at)}</span>
                              </div>
                              <span className="text-xs font-semibold text-teal-700">
                                {formatCurrency(call.outstanding_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Select a date to view invoice calls
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
