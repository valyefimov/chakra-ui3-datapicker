import { useDisclosure, useUpdateEffect } from '@chakra-ui/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useControllableState } from './use-controllable-state';

export type DatePickerSelection = Date | null;

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export type DatePickerValue = DatePickerSelection | DateRangeValue;

export interface UseDatePickerProps {
  /**
   * Unique id used to associate input and content elements.
   */
  id?: string;
  /**
   * Whether the picker operates in range selection mode.
   */
  isRange?: boolean;
  /**
   * Controlled value for the picker.
   */
  value?: DatePickerValue;
  /**
   * Default value for the picker when uncontrolled.
   */
  defaultValue?: DatePickerValue;
  /**
   * Callback fired when selection changes.
   */
  onChange?: (value: DatePickerValue) => void;
  /**
   * Called when the popover opens.
   */
  onOpen?: () => void;
  /**
   * Called when the popover closes.
   */
  onClose?: () => void;
  /**
   * Whether the popover closes after selection.
   */
  closeOnSelect?: boolean;
  /**
   * Whether focusing the input should open the popover.
   */
  openOnFocus?: boolean;
  /**
   * Earliest selectable date.
   */
  minDate?: Date;
  /**
   * Latest selectable date.
   */
  maxDate?: Date;
  /**
   * Locale used for formatting month, weekday and date labels.
   */
  locale?: string;
  /**
   * Week day the calendar grid starts on (0 = Sunday, 1 = Monday, ...).
   */
  weekStartsOn?: number;
  /**
   * Prevents selection of specific dates.
   */
  isDateUnavailable?: (date: Date) => boolean;
  /**
   * Allows selecting the same date for start and end in range mode.
   */
  allowSameDateSelection?: boolean;
  /**
   * Initial visible month when uncontrolled.
   */
  defaultVisibleDate?: Date;
  /**
   * Controlled open state.
   */
  isOpen?: boolean;
  /**
   * Default open state when uncontrolled.
   */
  defaultIsOpen?: boolean;
  /**
   * Spacing between trigger and content.
   */
  gutter?: number;
  /**
   * Popper placement.
   */
  placement?: string;
  /**
   * Enables the optional time selector.
   */
  enableTimeSelection?: boolean;
  /**
   * Controlled time value in `HH:MM` format (24h).
   */
  timeValue?: string;
  /**
   * Default time when uncontrolled.
   */
  defaultTimeValue?: string;
  /**
   * Notifies consumer when time string changes.
   */
  onTimeChange?: (time: string) => void;
}

export interface CalendarDay {
  date: Date;
  label: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

export interface UseDatePickerReturn {
  isOpen: boolean;
  isRange: boolean;
  value: DatePickerValue;
  time: string | null;
  enableTimeSelection: boolean;
  locale: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  weekStartsOn: number;
  viewMonth: number;
  viewYear: number;
  focusedDate: Date;
  weekDays: string[];
  weeks: CalendarDay[][];
  triggerRef: React.RefObject<HTMLElement>;
  contentRef: React.RefObject<HTMLElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  timeInputRef: React.RefObject<HTMLInputElement>;
  hasSelectedDate: boolean;
  isDateSelected: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectDate: (date: Date) => void;
  clear: () => void;
  gotoPreviousMonth: () => void;
  gotoNextMonth: () => void;
  gotoMonth: (month: number) => void;
  gotoYear: (year: number) => void;
  getRootProps: () => Record<string, unknown>;
  getControlProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  getTriggerProps: () => Record<string, unknown>;
  getContentProps: () => Record<string, unknown>;
  getCalendarGridProps: () => Record<string, unknown>;
  getDayProps: (day: CalendarDay) => Record<string, unknown>;
  getPrevTriggerProps: () => Record<string, unknown>;
  getNextTriggerProps: () => Record<string, unknown>;
  getMonthSelectProps: () => Record<string, unknown>;
  getYearSelectProps: () => Record<string, unknown>;
  getTimeInputProps: () => Record<string, unknown>;
  placement: string;
  gutter: number;
}

function isDateRange(value: DatePickerValue | undefined): value is DateRangeValue {
  return !!value && typeof value === 'object' && 'start' in value && 'end' in value;
}

function normalizeDate(value: Date | null): Date | null {
  if (!value) return null;
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function clampDate(date: Date, min?: Date, max?: Date) {
  let next = new Date(date);
  if (min && next < min) next = new Date(min);
  if (max && next > max) next = new Date(max);
  return next;
}

interface UseOutsideClickOptions {
  ref: React.RefObject<HTMLElement | null>;
  handler: (event: PointerEvent | MouseEvent) => void;
  enabled?: boolean;
}

function useOutsideClick({ ref, handler, enabled = true }: UseOutsideClickOptions) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: PointerEvent | MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      if (node.contains(event.target as Node)) return;
      handlerRef.current(event);
    };

    document.addEventListener('pointerdown', listener);
    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, [enabled, ref]);
}

function areSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function compareDay(a: Date, b: Date) {
  return (
    a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth() || a.getDate() - b.getDate()
  );
}

function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function getMonthDays(
  viewDate: Date,
  options: {
    locale?: string;
    weekStartsOn?: number;
    minDate?: Date;
    maxDate?: Date;
    isDateUnavailable?: (date: Date) => boolean;
  },
): { weeks: CalendarDay[][]; weekDays: string[] } {
  const { locale = 'default', weekStartsOn = 0, minDate, maxDate, isDateUnavailable } = options;
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startDay = firstOfMonth.getDay();
  const diff = (startDay - weekStartsOn + 7) % 7;
  const startGrid = new Date(firstOfMonth);
  startGrid.setDate(firstOfMonth.getDate() - diff);

  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const normalizedMin = minDate ? normalizeDate(minDate) : null;
  const normalizedMax = maxDate ? normalizeDate(maxDate) : null;
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(2023, 0, weekStartsOn + index + 1);
    return formatter.format(date);
  });

  const weeks: CalendarDay[][] = [];
  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const days: CalendarDay[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const current = new Date(startGrid);
      current.setDate(startGrid.getDate() + weekIndex * 7 + dayIndex);
      const isCurrentMonth = current.getMonth() === viewDate.getMonth();
      const isToday = areSameDay(current, new Date());
      const isBeforeMin = !!normalizedMin && current < normalizedMin;
      const isAfterMax = !!normalizedMax && current > normalizedMax;
      const isUnavailable = !!isDateUnavailable?.(current);
      days.push({
        date: current,
        label: String(current.getDate()),
        isToday,
        isCurrentMonth,
        isDisabled: isBeforeMin || isAfterMax || isUnavailable,
      });
    }
    weeks.push(days);
  }

  return { weeks, weekDays };
}

function formatDateLabel(value: DatePickerValue, locale: string) {
  if (!value) return '';
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (isDateRange(value)) {
    const { start, end } = value;
    if (!start && !end) return '';
    if (start && end) return `${formatter.format(start)} – ${formatter.format(end)}`;
    if (start) return `${formatter.format(start)} –`;
    if (end) return `– ${formatter.format(end)}`;
    return '';
  }

  return value ? formatter.format(value as Date) : '';
}

function getInitialViewDate(value: DatePickerValue | undefined, fallback?: Date) {
  if (value && !isDateRange(value) && value) return value as Date;
  if (value && isDateRange(value) && value.start) return value.start;
  return fallback ?? new Date();
}

const escapeId = (value: string) => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/[.#:[\], ]/g, '\\$&');
};

function normalizeRange(value: DateRangeValue | undefined | null): DateRangeValue | null {
  if (!value) return null;
  return {
    start: normalizeDate(value.start) ?? null,
    end: normalizeDate(value.end) ?? null,
  };
}

function ensureRangeOrder(range: DateRangeValue | null, allowSame: boolean): DateRangeValue | null {
  if (!range) return range;
  const { start, end } = range;
  if (!start || !end) return range;
  const compare = compareDay(start, end);
  if (compare === 0 && allowSame) return range;
  if (compare <= 0) return range;
  return { start: end, end: start };
}

function toTimeString(value: DatePickerValue): string | null {
  if (!value) return null;
  const date = isDateRange(value) ? (value.end ?? value.start) : (value as Date | null);
  if (!date) return null;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function useDatePicker(props: UseDatePickerProps): UseDatePickerReturn {
  const {
    id: idProp,
    isRange = false,
    value: valueProp,
    defaultValue,
    onChange,
    closeOnSelect = true,
    openOnFocus = true,
    minDate,
    maxDate,
    locale = 'default',
    weekStartsOn = 0,
    isDateUnavailable,
    allowSameDateSelection = true,
    defaultVisibleDate,
    isOpen: isOpenProp,
    defaultIsOpen,
    onOpen,
    onClose,
    gutter = 8,
    placement = 'bottom-start',
    enableTimeSelection = false,
    timeValue: timeProp,
    defaultTimeValue,
    onTimeChange,
  } = props;

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const focusedDateRef = useRef<Date>(
    normalizeDate(defaultVisibleDate ?? new Date()) ?? new Date(),
  );

  const initialValue = useMemo(() => {
    if (valueProp !== undefined) return valueProp;
    return isRange
      ? (normalizeRange(defaultValue as DateRangeValue) ?? null)
      : normalizeDate(defaultValue as Date);
  }, [valueProp, defaultValue, isRange]);

  const [value, setValue] = useControllableState<DatePickerValue | null>({
    value: valueProp,
    defaultValue: initialValue ?? null,
    onChange: (next) => {
      onChange?.(next as DatePickerValue);
    },
  });

  const initialView = useMemo(
    () => getInitialViewDate(initialValue ?? undefined, defaultVisibleDate),
    [initialValue, defaultVisibleDate],
  );

  const [view, setView] = useState(() => normalizeDate(initialView) ?? new Date());
  const [lastHighlighted, setLastHighlighted] = useState<Date>(
    () => normalizeDate(initialView) ?? new Date(),
  );

  const timeInitial = useMemo(() => {
    if (timeProp !== undefined) return timeProp;
    if (enableTimeSelection) return defaultTimeValue ?? toTimeString(initialValue);
    return null;
  }, [timeProp, enableTimeSelection, defaultTimeValue, initialValue]);

  const [time, setTime] = useControllableState<string | null>({
    value: timeProp,
    defaultValue: timeInitial ?? null,
    onChange: (next) => {
      if (next != null) onTimeChange?.(next);
    },
  });

  useEffect(() => {
    if (value == null) return;
    if (isDateRange(value)) {
      const anchor = value.end ?? value.start;
      if (anchor) {
        setView(normalizeDate(anchor) ?? new Date());
        setLastHighlighted(normalizeDate(anchor) ?? new Date());
      }
    } else if (value instanceof Date) {
      setView(normalizeDate(value) ?? new Date());
      setLastHighlighted(normalizeDate(value) ?? new Date());
    }
  }, [value]);

  const disclosure = useDisclosure({
    open: isOpenProp,
    defaultOpen: defaultIsOpen,
    onOpen,
    onClose,
  });

  const isOpen = disclosure.open;
  const { onOpen: open, onClose: close, onToggle: toggle } = disclosure;

  const { weeks, weekDays } = useMemo(
    () =>
      getMonthDays(view ?? new Date(), {
        locale,
        weekStartsOn,
        minDate: minDate ? (normalizeDate(minDate) ?? undefined) : undefined,
        maxDate: maxDate ? (normalizeDate(maxDate) ?? undefined) : undefined,
        isDateUnavailable,
      }),
    [view, locale, weekStartsOn, minDate, maxDate, isDateUnavailable],
  );

  const hasSelectedDate = useMemo(() => {
    if (!value) return false;
    if (isDateRange(value)) {
      return !!value.start || !!value.end;
    }
    return value instanceof Date;
  }, [value]);

  const isDateSelected = useCallback(
    (day: Date) => {
      const date = normalizeDate(day);
      if (!value || !date) return false;
      if (isDateRange(value)) {
        return areSameDay(date, value.start) || areSameDay(date, value.end);
      }
      return areSameDay(date, value as Date);
    },
    [value],
  );

  const isInRange = useCallback(
    (day: Date) => {
      const date = normalizeDate(day);
      if (!value || !date || !isRange || !isDateRange(value)) return false;
      const { start, end } = value;
      if (!start || !end) return false;
      return compareDay(start, date) <= 0 && compareDay(date, end) <= 0;
    },
    [value, isRange],
  );

  const selectDate = useCallback(
    (day: Date) => {
      if (!day) return;
      const date = normalizeDate(
        clampDate(
          day,
          minDate ? (normalizeDate(minDate) ?? undefined) : undefined,
          maxDate ? (normalizeDate(maxDate) ?? undefined) : undefined,
        ),
      );
      if (!date) return;
      setLastHighlighted(date);

      if (isRange) {
        const current = isDateRange(value) ? value : null;
        if (!current || (current.start && current.end)) {
          const nextRange: DateRangeValue = { start: date, end: null };
          setValue(nextRange);
          if (enableTimeSelection && time) {
            const [hours, minutes] = time.split(':');
            nextRange.start?.setHours(Number(hours), Number(minutes), 0, 0);
          }
          return;
        }
        if (!current.start) {
          const nextRange: DateRangeValue = { start: date, end: null };
          setValue(nextRange);
          return;
        }
        const nextRange: DateRangeValue = { start: current.start, end: date };
        const ordered = ensureRangeOrder(nextRange, allowSameDateSelection);
        setValue(ordered);
        if (closeOnSelect) close();
        if (enableTimeSelection && time) {
          const [hours, minutes] = time.split(':');
          ordered?.end?.setHours(Number(hours), Number(minutes), 0, 0);
        }
        return;
      }

      const nextValue = date;
      if (enableTimeSelection && time) {
        const [hours, minutes] = time.split(':');
        nextValue.setHours(Number(hours), Number(minutes), 0, 0);
      }
      setValue(nextValue);
      if (closeOnSelect) close();
    },
    [
      allowSameDateSelection,
      close,
      closeOnSelect,
      enableTimeSelection,
      isRange,
      maxDate,
      minDate,
      setValue,
      time,
      value,
    ],
  );

  const clear = useCallback(() => {
    if (isRange) {
      setValue({ start: null, end: null });
    } else {
      setValue(null);
    }
  }, [isRange, setValue]);

  const gotoPreviousMonth = useCallback(() => {
    setView((prev) => addMonths(prev, -1));
  }, []);

  const gotoNextMonth = useCallback(() => {
    setView((prev) => addMonths(prev, 1));
  }, []);

  const gotoMonth = useCallback((month: number) => {
    setView((prev) => {
      const next = new Date(prev);
      next.setMonth(month);
      return next;
    });
  }, []);

  const gotoYear = useCallback((year: number) => {
    setView((prev) => {
      const next = new Date(prev);
      next.setFullYear(year);
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent, day: Date) => {
      const key = event.key;
      let next = new Date(day);
      switch (key) {
        case 'ArrowRight':
          next.setDate(day.getDate() + 1);
          break;
        case 'ArrowLeft':
          next.setDate(day.getDate() - 1);
          break;
        case 'ArrowDown':
          next.setDate(day.getDate() + 7);
          break;
        case 'ArrowUp':
          next.setDate(day.getDate() - 7);
          break;
        case 'PageDown':
          if (event.shiftKey) {
            next = addMonths(day, -12);
          } else {
            next = addMonths(day, 1);
          }
          break;
        case 'PageUp':
          if (event.shiftKey) {
            next = addMonths(day, 12);
          } else {
            next = addMonths(day, -1);
          }
          break;
        case 'Home':
          next.setDate(day.getDate() - ((day.getDay() - weekStartsOn + 7) % 7));
          break;
        case 'End':
          next.setDate(day.getDate() + (6 - ((day.getDay() - weekStartsOn + 7) % 7)));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          selectDate(day);
          return;
        default:
          return;
      }
      event.preventDefault();
      setLastHighlighted(normalizeDate(next) ?? next);
      setView((prev) => {
        const candidate = normalizeDate(next) ?? next;
        if (!candidate) return prev;
        if (
          candidate.getMonth() !== prev.getMonth() ||
          candidate.getFullYear() !== prev.getFullYear()
        ) {
          return normalizeDate(candidate) ?? candidate;
        }
        return prev;
      });
      focusedDateRef.current = normalizeDate(next) ?? next;
    },
    [selectDate, weekStartsOn],
  );

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const node = contentRef.current;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    };
    node.addEventListener('keydown', listener);
    return () => node.removeEventListener('keydown', listener);
  }, [close, isOpen]);

  useOutsideClick({
    ref: contentRef,
    handler: (event) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      close();
    },
    enabled: isOpen,
  });

  const getRootProps = useCallback(
    () => ({
      id: `${id}-root`,
      'data-part': 'root',
    }),
    [id],
  );

  const getControlProps = useCallback(
    () => ({
      id: `${id}-control`,
      'data-part': 'control',
      onClick: () => {
        if (isOpen) {
          close();
        } else {
          open();
        }
      },
    }),
    [close, id, isOpen, open],
  );

  const getInputProps = useCallback(
    () => ({
      id: `${id}-input`,
      ref: inputRef,
      readOnly: true,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-controls': `${id}-content`,
      'aria-haspopup': 'dialog',
      value: formatDateLabel(value ?? null, locale),
      placeholder: isRange ? 'Select date range' : 'Select date',
      onFocus: () => {
        if (openOnFocus) open();
      },
    }),
    [id, inputRef, isOpen, locale, open, openOnFocus, value, isRange],
  );

  const getTriggerProps = useCallback(
    () => ({
      id: `${id}-trigger`,
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': `${id}-content`,
      onClick: () => toggle(),
    }),
    [id, isOpen, toggle],
  );

  const getContentProps = useCallback(
    () => ({
      id: `${id}-content`,
      ref: (node: HTMLElement | null) => {
        contentRef.current = node;
      },
      role: 'dialog',
      tabIndex: -1,
      'aria-modal': false,
      hidden: !isOpen,
    }),
    [id, isOpen],
  );

  const getCalendarGridProps = useCallback(
    () => ({
      id: `${id}-grid`,
      role: 'grid',
      'aria-labelledby': `${id}-label`,
    }),
    [id],
  );

  const getDayProps = useCallback(
    (day: CalendarDay) => ({
      id: `${id}-day-${day.date.toISOString()}`,
      role: 'gridcell',
      tabIndex: areSameDay(day.date, lastHighlighted) ? 0 : -1,
      'aria-selected': isDateSelected(day.date),
      'aria-label': new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(day.date),
      disabled: day.isDisabled,
      'data-selected': isDateSelected(day.date) ? 'true' : undefined,
      'data-in-range': isInRange(day.date) ? 'true' : undefined,
      'data-today': day.isToday ? 'true' : undefined,
      'data-outside': day.isCurrentMonth ? undefined : 'true',
      onClick: () => selectDate(day.date),
      onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(event.nativeEvent, day.date),
      onFocus: () => setLastHighlighted(day.date),
    }),
    [handleKeyDown, id, isDateSelected, isInRange, lastHighlighted, locale, selectDate],
  );

  const getPrevTriggerProps = useCallback(
    () => ({
      'aria-label': 'Go to previous month',
      onClick: gotoPreviousMonth,
    }),
    [gotoPreviousMonth],
  );

  const getNextTriggerProps = useCallback(
    () => ({
      'aria-label': 'Go to next month',
      onClick: gotoNextMonth,
    }),
    [gotoNextMonth],
  );

  const getMonthSelectProps = useCallback(
    () => ({
      value: view.getMonth(),
      onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
        gotoMonth(Number(event.target.value));
      },
    }),
    [gotoMonth, view],
  );

  const getYearSelectProps = useCallback(
    () => ({
      value: view.getFullYear(),
      onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
        gotoYear(Number(event.target.value));
      },
    }),
    [gotoYear, view],
  );

  const getTimeInputProps = useCallback(
    () => ({
      id: `${id}-time`,
      ref: timeInputRef,
      type: 'time',
      value: time ?? '',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setTime(next);
        if (!value) return;
        if (isRange && isDateRange(value)) {
          const start = value.start ? new Date(value.start) : null;
          const end = value.end ? new Date(value.end) : start;
          const [hours, minutes] = next.split(':');
          if (start) start.setHours(Number(hours), Number(minutes), 0, 0);
          if (end) end.setHours(Number(hours), Number(minutes), 0, 0);
          setValue({ start, end });
          return;
        }
        if (value instanceof Date) {
          const nextDate = new Date(value);
          const [hours, minutes] = next.split(':');
          nextDate.setHours(Number(hours), Number(minutes), 0, 0);
          setValue(nextDate);
        }
      },
    }),
    [id, isRange, setTime, setValue, time, value],
  );

  useUpdateEffect(() => {
    if (!isOpen) return;
    const node = focusedDateRef.current ?? view;
    const dayId = `${id}-day-${node.toISOString()}`;
    const el = contentRef.current?.querySelector<HTMLElement>(`#${escapeId(dayId)}`);
    el?.focus();
  }, [isOpen, view, id]);

  return {
    isOpen,
    isRange,
    value: value ?? null,
    time: time ?? null,
    enableTimeSelection,
    viewMonth: view.getMonth(),
    viewYear: view.getFullYear(),
    focusedDate: lastHighlighted,
    weekDays,
    weeks,
    triggerRef,
    contentRef,
    inputRef,
    timeInputRef,
    hasSelectedDate,
    isDateSelected,
    isInRange,
    open,
    close,
    toggle,
    selectDate,
    clear,
    gotoPreviousMonth,
    gotoNextMonth,
    gotoMonth,
    gotoYear,
    getRootProps,
    getControlProps,
    getInputProps,
    getTriggerProps,
    getContentProps,
    getCalendarGridProps,
    getDayProps,
    getPrevTriggerProps,
    getNextTriggerProps,
    getMonthSelectProps,
    getYearSelectProps,
    getTimeInputProps,
    locale,
    minDate: minDate ? normalizeDate(minDate) : null,
    maxDate: maxDate ? normalizeDate(maxDate) : null,
    weekStartsOn,
    placement,
    gutter,
  };
}

export interface DatePickerContextValue extends UseDatePickerReturn {
  yearRange?: { start: number; end: number };
  monthNames?: string[];
}

export const DatePickerContext = createContext<DatePickerContextValue | undefined>(undefined);

export function DatePickerProvider({
  value,
  children,
}: {
  value: DatePickerContextValue;
  children: React.ReactNode;
}) {
  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
}

export function useDatePickerContext(componentName = 'DatePicker') {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a DatePickerProvider`);
  }
  return context;
}
