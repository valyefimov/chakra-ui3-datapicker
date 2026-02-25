import { Button, chakra, HStack, Text } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';
import React from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';
import {
  CalendarDay,
  DatePickerProvider,
  useDatePicker,
  useDatePickerContext,
  UseDatePickerProps,
} from './use-date-picker';
import type { DatePickerContextValue } from './use-date-picker';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(value);
        return;
      }

      (ref as React.MutableRefObject<T | null>).current = value;
    });
  };
}

const DATE_PICKER_SLOTS = [
  'root',
  'control',
  'input',
  'trigger',
  'content',
  'header',
  'navButton',
  'monthLabel',
  'month',
  'year',
  'calendar',
  'weekdays',
  'weekday',
  'grid',
  'day',
  'time',
  'timeInput',
  'footer',
] as const;

type DatePickerSlot = (typeof DATE_PICKER_SLOTS)[number];
type DatePickerStyles = Record<DatePickerSlot, SystemStyleObject>;

const SURFACE = 'var(--chakra-colors-gray-900, #0f1014)';
const SURFACE_MUTED = 'rgba(255, 255, 255, 0.06)';
const SURFACE_ELEVATED = 'var(--chakra-colors-gray-900, #0f1014)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const BORDER_SOFT = 'rgba(255, 255, 255, 0.06)';
const TEXT = 'rgba(244, 244, 245, 0.97)';
const TEXT_MUTED = 'rgba(244, 244, 245, 0.68)';
const TEXT_SUBTLE = 'rgba(244, 244, 245, 0.42)';
const ACCENT = 'rgba(244, 244, 245, 0.92)';
const ACCENT_LIGHT = 'rgba(244, 244, 245, 0.24)';
const RANGE_BG = 'rgba(244, 244, 245, 0.12)';
const HOVER_BG = 'rgba(244, 244, 245, 0.1)';
const SHADOW = '0px 32px 70px rgba(2, 6, 23, 0.6)';

const defaultStyles: DatePickerStyles = {
  root: {
    position: 'relative',
    color: TEXT,
    fontSize: '0.875rem',
  },
  control: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '1rem',
    paddingInline: '1.1rem',
    paddingBlock: '0.7rem',
    background: SURFACE,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'rgba(244, 244, 245, 0.22)',
    },
    '&:focus-within': {
      borderColor: 'rgba(148, 163, 184, 0.42)',
      boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.42)',
    },
  },
  input: {
    flex: 1,
    minWidth: 0,
    background: 'transparent',
    border: 0,
    outline: 0,
    fontSize: 'inherit',
    color: 'inherit',
    padding: 0,
    '&::placeholder': {
      color: TEXT_MUTED,
    },
    '&:focus': {
      outline: 'none',
    },
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.625rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.35rem',
    color: TEXT_MUTED,
    background: SURFACE_MUTED,
    transition: 'background 0.2s ease, color 0.2s ease',
    '&:hover': {
      color: TEXT,
      background: HOVER_BG,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
  },
  content: {
    marginTop: '0.75rem',
    background: SURFACE_ELEVATED,
    border: `1px solid ${BORDER}`,
    borderRadius: '1.5rem',
    boxShadow: SHADOW,
    paddingInline: '1.75rem',
    paddingBlock: '1.9rem',
    minWidth: '21rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    width: '100%',
    marginBottom: '1.25rem',
  },
  navButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '999px',
    color: TEXT,
    background: 'transparent',
    transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      background: HOVER_BG,
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: '1.35rem',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: TEXT,
  },
  month: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  year: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.6rem',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: TEXT_SUBTLE,
  },
  weekday: {
    textAlign: 'center',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.6rem',
  },
  day: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    width: '2.6rem',
    height: '2.6rem',
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
    border: '1px solid transparent',
    cursor: 'pointer',
    color: TEXT,
    '&:hover': {
      background: HOVER_BG,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
    '&[data-selected="true"]': {
      background: 'rgba(148, 163, 184, 0.3)',
      borderColor: 'rgba(244, 244, 245, 0.42)',
      color: ACCENT,
      boxShadow: 'inset 0 -1px 0 0 rgba(244, 244, 245, 0.6)',
    },
    '&[data-in-range="true"]': {
      background: RANGE_BG,
      color: TEXT,
    },
    '&[data-today="true"]': {
      borderColor: 'rgba(244, 244, 245, 0.34)',
      fontWeight: 600,
    },
    '&[data-today="true"][data-selected="true"]': {
      background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.44), rgba(148, 163, 184, 0.3))',
      borderColor: 'rgba(244, 244, 245, 0.68)',
      boxShadow: '0 0 0 1px rgba(244, 244, 245, 0.28), 0 8px 16px rgba(2, 6, 23, 0.3)',
    },
    '&[data-outside="true"]': {
      color: TEXT_SUBTLE,
    },
    '&[disabled]': {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
  },
  time: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  timeInput: {
    flex: 1,
    maxWidth: '8rem',
    borderRadius: '0.75rem',
    border: `1px solid ${BORDER_SOFT}`,
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    background: SURFACE,
    color: TEXT,
    fontVariantNumeric: 'tabular-nums',
    '&::placeholder': {
      color: TEXT_MUTED,
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: 'rgba(148, 163, 184, 0.45)',
      boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.45)',
    },
  },
  footer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
  },
};

const DatePickerStylesContext = React.createContext<DatePickerStyles | null>(null);

function useStyles(): DatePickerStyles {
  const styles = React.useContext(DatePickerStylesContext);
  if (!styles) {
    throw new Error('DatePicker components must be used within <DatePicker.Root>');
  }
  return styles;
}

function mergeSlotStyles(overrides?: Partial<DatePickerStyles>): DatePickerStyles {
  if (!overrides) return defaultStyles;
  const entries = DATE_PICKER_SLOTS.map((slot) => [
    slot,
    { ...defaultStyles[slot], ...(overrides?.[slot] ?? {}) },
  ]);
  return Object.fromEntries(entries) as DatePickerStyles;
}

function getPlacementStyles(placement: string | undefined, gutter: number): SystemStyleObject {
  const [side = 'bottom', align = 'start'] = (placement ?? 'bottom-start').split('-') as [
    string,
    string?,
  ];
  const offset = `${gutter}px`;
  const style: SystemStyleObject = {
    position: 'absolute',
    zIndex: 20,
  };

  switch (side) {
    case 'top':
      style.bottom = `calc(100% + ${offset})`;
      break;
    case 'left':
      style.right = `calc(100% + ${offset})`;
      break;
    case 'right':
      style.left = `calc(100% + ${offset})`;
      break;
    case 'bottom':
    default:
      style.top = `calc(100% + ${offset})`;
      break;
  }

  if (side === 'left' || side === 'right') {
    if (align === 'end') {
      style.bottom = '0';
    } else if (align === 'center') {
      style.top = '50%';
      style.transform = 'translateY(-50%)';
    } else {
      style.top = '0';
    }
  } else {
    if (align === 'end') {
      style.right = '0';
    } else if (align === 'center') {
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else {
      style.left = '0';
    }
  }

  return style;
}

type DivProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'value'>;
type ButtonElementProps = React.ComponentPropsWithoutRef<'button'>;
type InputElementProps = React.ComponentPropsWithoutRef<'input'>;

export interface DatePickerProps extends UseDatePickerProps, Omit<DivProps, 'children'> {
  children?: React.ReactNode;
  yearRange?: { start: number; end: number };
  styles?: Partial<DatePickerStyles>;
}

export const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const {
    children,
    className,
    styles: stylesProp,
    yearRange,
    style: styleProp,
    id,
    isRange,
    value,
    defaultValue,
    onChange,
    closeOnSelect,
    openOnFocus,
    minDate,
    maxDate,
    locale,
    weekStartsOn,
    isDateUnavailable,
    allowSameDateSelection,
    defaultVisibleDate,
    isOpen,
    defaultIsOpen,
    onOpen,
    onClose,
    gutter = 8,
    placement = 'bottom-start',
    enableTimeSelection = false,
    timeValue,
    defaultTimeValue,
    onTimeChange,
    ...rest
  } = props;

  const api = useDatePicker({
    id,
    isRange,
    value,
    defaultValue,
    onChange,
    closeOnSelect,
    openOnFocus,
    minDate,
    maxDate,
    locale,
    weekStartsOn,
    isDateUnavailable,
    allowSameDateSelection,
    defaultVisibleDate,
    isOpen,
    defaultIsOpen,
    onOpen,
    onClose,
    gutter,
    placement,
    enableTimeSelection,
    timeValue,
    defaultTimeValue,
    onTimeChange,
  });

  const monthNames = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, month) =>
      new Intl.DateTimeFormat(api.locale, { month: 'long' }).format(new Date(2020, month, 1)),
    );
  }, [api.locale]);

  const contextValue = React.useMemo<DatePickerContextValue>(
    () => ({
      ...api,
      yearRange,
      monthNames,
    }),
    [api, monthNames, yearRange],
  );

  const styles = React.useMemo(() => mergeSlotStyles(stylesProp), [stylesProp]);
  const combinedClassName = cx('chakra-date-picker', className);

  return (
    <DatePickerProvider value={contextValue}>
      <DatePickerStylesContext.Provider value={styles}>
        <chakra.div
          ref={ref}
          {...api.getRootProps()}
          {...rest}
          className={combinedClassName}
          css={styles.root}
          style={styleProp}
        >
          {children ?? <DatePickerPrimitive />}
        </chakra.div>
      </DatePickerStylesContext.Provider>
    </DatePickerProvider>
  );
});
DatePickerRoot.displayName = 'DatePickerRoot';

const DatePickerPrimitive = () => (
  <>
    <DatePickerControl>
      <DatePickerInput />
      <DatePickerTrigger aria-label="Toggle calendar">
        <CalendarIcon />
      </DatePickerTrigger>
    </DatePickerControl>
    <DatePickerContent />
  </>
);

export type DatePickerControlProps = DivProps;

export const DatePickerControl = React.forwardRef<HTMLDivElement, DatePickerControlProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerControl');
    const styles = useStyles();
    const { children, className, style, ...rest } = props;
    const controlProps = api.getControlProps();

    return (
      <chakra.div
        ref={ref}
        className={cx('chakra-date-picker__control', className)}
        css={styles.control}
        style={style}
        {...controlProps}
        {...rest}
      >
        {children}
      </chakra.div>
    );
  },
);
DatePickerControl.displayName = 'DatePickerControl';

export type DatePickerInputProps = InputElementProps;

export const DatePickerInput = React.forwardRef<HTMLInputElement, DatePickerInputProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerInput');
    const styles = useStyles();
    const inputProps = api.getInputProps();
    const {
      ref: inputRefProp,
      className: inputClassName,
      style: inputStyle,
      ...mergedProps
    } = inputProps as {
      ref?: React.Ref<HTMLInputElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    const { className, style, ...rest } = props;
    const mergedRef = mergeRefs(inputRefProp as React.Ref<HTMLInputElement>, ref);

    return (
      <chakra.input
        ref={mergedRef}
        className={cx('chakra-date-picker__input', inputClassName, className)}
        css={styles.input}
        style={{ ...(inputStyle ?? {}), ...(style ?? {}) }}
        {...mergedProps}
        {...rest}
      />
    );
  },
);
DatePickerInput.displayName = 'DatePickerInput';

export type DatePickerTriggerProps = ButtonElementProps;

export const DatePickerTrigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerTrigger');
    const styles = useStyles();
    const triggerProps = api.getTriggerProps();
    const {
      ref: triggerRefProp,
      className: triggerClassName,
      style: triggerStyle,
      ...restTrigger
    } = triggerProps as {
      ref?: React.Ref<HTMLButtonElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    const { className, style, children, ...rest } = props;
    const mergedRef = mergeRefs(triggerRefProp as React.Ref<HTMLButtonElement>, ref);

    return (
      <chakra.button
        ref={mergedRef}
        type="button"
        className={cx('chakra-date-picker__trigger', triggerClassName, className)}
        css={styles.trigger}
        style={{ ...(triggerStyle ?? {}), ...(style ?? {}) }}
        {...restTrigger}
        {...rest}
      >
        {children}
      </chakra.button>
    );
  },
);
DatePickerTrigger.displayName = 'DatePickerTrigger';

export interface DatePickerContentProps extends DivProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DatePickerContent = React.forwardRef<HTMLDivElement, DatePickerContentProps>(
  (props, ref) => {
    const { children, className, header, footer, style, ...rest } = props;
    const api = useDatePickerContext('DatePickerContent');
    const styles = useStyles();
    const contentProps = api.getContentProps();
    const {
      ref: contentRefProp,
      hidden,
      style: contentStyle,
      ...restContent
    } = contentProps as {
      ref?: React.Ref<HTMLElement>;
      hidden?: boolean;
      style?: React.CSSProperties;
    };

    if (!api.isOpen) return null;

    const mergedRef = mergeRefs(contentRefProp as React.Ref<HTMLElement>, ref);
    const placementStyles = getPlacementStyles(api.placement, api.gutter);

    return (
      <chakra.div
        ref={mergedRef}
        className={cx('chakra-date-picker__content', className)}
        css={{ ...styles.content, ...placementStyles }}
        style={{ ...(contentStyle ?? {}), ...(style ?? {}) }}
        hidden={hidden}
        {...restContent}
        {...rest}
      >
        {header ?? <DatePickerHeader />}
        <DatePickerCalendar>{children}</DatePickerCalendar>
        {api.enableTimeSelection ? <DatePickerTimeField /> : null}
        {footer ?? <DatePickerFooter />}
      </chakra.div>
    );
  },
);
DatePickerContent.displayName = 'DatePickerContent';

export type DatePickerHeaderProps = DivProps;

export const DatePickerHeader = React.forwardRef<HTMLDivElement, DatePickerHeaderProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerHeader');
    const styles = useStyles();
    const { className, style, ...rest } = props;

    const monthFormatter = React.useMemo(
      () => new Intl.DateTimeFormat(api.locale, { month: 'long' }),
      [api.locale],
    );

    const monthYearFormatter = React.useMemo(
      () => new Intl.DateTimeFormat(api.locale, { month: 'long', year: 'numeric' }),
      [api.locale],
    );

    const monthOptions = React.useMemo(
      () =>
        api.monthNames ??
        Array.from({ length: 12 }).map((_, index) =>
          monthFormatter.format(new Date(2020, index, 1)),
        ),
      [api.monthNames, monthFormatter],
    );

    const monthYearLabel = React.useMemo(
      () => monthYearFormatter.format(new Date(api.viewYear, api.viewMonth, 1)),
      [api.viewMonth, api.viewYear, monthYearFormatter],
    );

    const yearBounds = React.useMemo(() => {
      if (api.yearRange) return api.yearRange;
      if (api.minDate && api.maxDate) {
        return { start: api.minDate.getFullYear(), end: api.maxDate.getFullYear() };
      }
      if (api.minDate) {
        return { start: api.minDate.getFullYear(), end: api.viewYear + 50 };
      }
      if (api.maxDate) {
        return { start: api.viewYear - 50, end: api.maxDate.getFullYear() };
      }
      return { start: api.viewYear - 50, end: api.viewYear + 50 };
    }, [api.maxDate, api.minDate, api.viewYear, api.yearRange]);

    const years = React.useMemo(() => {
      const values: number[] = [];
      for (let year = yearBounds.start; year <= yearBounds.end; year++) {
        values.push(year);
      }
      return values;
    }, [yearBounds.end, yearBounds.start]);

    const monthSelectProps = api.getMonthSelectProps();
    const yearSelectProps = api.getYearSelectProps();
    const prevTriggerProps = api.getPrevTriggerProps();
    const nextTriggerProps = api.getNextTriggerProps();

    const {
      ref: prevRefProp,
      className: prevClassName,
      style: prevStyle,
      ...restPrevTrigger
    } = prevTriggerProps as {
      ref?: React.Ref<HTMLButtonElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    const {
      ref: nextRefProp,
      className: nextClassName,
      style: nextStyle,
      ...restNextTrigger
    } = nextTriggerProps as {
      ref?: React.Ref<HTMLButtonElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    const {
      ref: monthRefProp,
      className: monthClassName,
      style: monthStyle,
      ...restMonthSelect
    } = monthSelectProps as {
      ref?: React.Ref<HTMLSelectElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    const {
      ref: yearRefProp,
      className: yearClassName,
      style: yearStyle,
      ...restYearSelect
    } = yearSelectProps as {
      ref?: React.Ref<HTMLSelectElement>;
      className?: string;
      style?: React.CSSProperties;
    };

    return (
      <chakra.div
        ref={ref}
        className={cx('chakra-date-picker__header', className)}
        css={styles.header}
        style={style}
        {...rest}
      >
        <HStack justify="space-between" align="center" w="full" gap={4}>
          <chakra.button
            ref={prevRefProp as React.Ref<HTMLButtonElement>}
            type="button"
            className={cx(
              'chakra-date-picker__nav-button',
              'chakra-date-picker__nav-button--prev',
              prevClassName,
            )}
            css={styles.navButton}
            style={prevStyle}
            {...restPrevTrigger}
          >
            <ChevronLeftIcon />
          </chakra.button>
          <Text as="span" className="chakra-date-picker__month-label" css={styles.monthLabel}>
            {monthYearLabel}
          </Text>
          <chakra.button
            ref={nextRefProp as React.Ref<HTMLButtonElement>}
            type="button"
            className={cx(
              'chakra-date-picker__nav-button',
              'chakra-date-picker__nav-button--next',
              nextClassName,
            )}
            css={styles.navButton}
            style={nextStyle}
            {...restNextTrigger}
          >
            <ChevronRightIcon />
          </chakra.button>
        </HStack>
        <chakra.select
          ref={monthRefProp as React.Ref<HTMLSelectElement>}
          className={cx('chakra-date-picker__month-select', monthClassName)}
          css={styles.month}
          style={monthStyle}
          {...restMonthSelect}
        >
          {monthOptions.map((label, index) => (
            <option key={label} value={index}>
              {label}
            </option>
          ))}
        </chakra.select>
        <chakra.select
          ref={yearRefProp as React.Ref<HTMLSelectElement>}
          className={cx('chakra-date-picker__year-select', yearClassName)}
          css={styles.year}
          style={yearStyle}
          {...restYearSelect}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </chakra.select>
      </chakra.div>
    );
  },
);
DatePickerHeader.displayName = 'DatePickerHeader';

export type DatePickerCalendarProps = DivProps;

export const DatePickerCalendar = React.forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerCalendar');
    const styles = useStyles();
    const { children, className, style, ...rest } = props;

    return (
      <chakra.div
        ref={ref}
        className={cx('chakra-date-picker__calendar', className)}
        css={styles.calendar}
        style={style}
        {...rest}
      >
        <chakra.div className="chakra-date-picker__weekdays" css={styles.weekdays}>
          {api.weekDays.map((label) => (
            <Text key={label} as="span" role="columnheader" css={styles.weekday}>
              {label}
            </Text>
          ))}
        </chakra.div>
        <chakra.div {...api.getCalendarGridProps()} css={styles.grid}>
          {api.weeks.flat().map((day) => (
            <DatePickerDayCell key={day.date.toISOString()} day={day} />
          ))}
        </chakra.div>
        {children}
      </chakra.div>
    );
  },
);
DatePickerCalendar.displayName = 'DatePickerCalendar';

export interface DatePickerDayCellProps extends ButtonElementProps {
  day: CalendarDay;
}

export const DatePickerDayCell = React.forwardRef<HTMLButtonElement, DatePickerDayCellProps>(
  ({ day, children, className, style, ...rest }, ref) => {
    const api = useDatePickerContext('DatePickerDay');
    const styles = useStyles();
    const dayProps = api.getDayProps(day);
    const {
      ref: dayRef,
      className: dayClassName,
      style: dayStyle,
      ...restDayProps
    } = dayProps as {
      ref?: React.Ref<HTMLButtonElement>;
      className?: string;
      style?: React.CSSProperties;
    };
    const mergedRef = mergeRefs(dayRef as React.Ref<HTMLButtonElement>, ref);

    return (
      <chakra.button
        ref={mergedRef}
        className={cx('chakra-date-picker__day', dayClassName, className)}
        css={styles.day}
        style={{ ...(dayStyle ?? {}), ...(style ?? {}) }}
        {...restDayProps}
        {...rest}
      >
        {children ?? day.label}
      </chakra.button>
    );
  },
);
DatePickerDayCell.displayName = 'DatePickerDayCell';

export type DatePickerTimeFieldProps = DivProps;

export const DatePickerTimeField = React.forwardRef<HTMLDivElement, DatePickerTimeFieldProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerTimeField');
    const styles = useStyles();
    if (!api.enableTimeSelection) return null;
    const timeInputProps = api.getTimeInputProps();
    const { className, style, ...rest } = props;
    const {
      className: timeClassName,
      style: timeStyle,
      ...restTimeInput
    } = timeInputProps as {
      className?: string;
      style?: React.CSSProperties;
    };

    return (
      <HStack
        ref={ref}
        className={cx('chakra-date-picker__time', className)}
        css={styles.time}
        style={style}
        gap={3}
        {...rest}
      >
        <Text fontSize="sm" color="inherit">
          Time
        </Text>
        <chakra.input
          type="time"
          className={timeClassName}
          css={styles.timeInput}
          style={timeStyle}
          {...restTimeInput}
        />
      </HStack>
    );
  },
);
DatePickerTimeField.displayName = 'DatePickerTimeField';

export type DatePickerFooterProps = DivProps;

export const DatePickerFooter = React.forwardRef<HTMLDivElement, DatePickerFooterProps>(
  (props, ref) => {
    const api = useDatePickerContext('DatePickerFooter');
    const styles = useStyles();
    const { className, style, ...rest } = props;

    return (
      <chakra.div
        ref={ref}
        className={cx('chakra-date-picker__footer', className)}
        css={styles.footer}
        style={style}
        {...rest}
      >
        <Button
          size="sm"
          variant="ghost"
          colorScheme="whiteAlpha"
          opacity={api.hasSelectedDate ? 0.7 : 0.35}
          onClick={() => api.clear()}
          disabled={!api.hasSelectedDate}
        >
          Clear
        </Button>
        <Button size="sm" borderRadius="md" px={5} colorScheme="teal" onClick={() => api.close()}>
          Done
        </Button>
      </chakra.div>
    );
  },
);
DatePickerFooter.displayName = 'DatePickerFooter';

export const DatePicker = Object.assign(DatePickerRoot, {
  Root: DatePickerRoot,
  Control: DatePickerControl,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Content: DatePickerContent,
  Header: DatePickerHeader,
  Calendar: DatePickerCalendar,
  Day: DatePickerDayCell,
  TimeField: DatePickerTimeField,
  Footer: DatePickerFooter,
});

export default DatePicker;
