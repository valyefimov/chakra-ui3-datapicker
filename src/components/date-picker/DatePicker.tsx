import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { Button, chakra, HStack, IconButton, Text } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';
import { cx } from '@chakra-ui/utils';
import { mergeRefs } from '@chakra-ui/react-use-merge-refs';
import React from 'react';
import {
  CalendarDay,
  DatePickerProvider,
  useDatePicker,
  useDatePickerContext,
  UseDatePickerProps,
} from './use-date-picker';
import type { DatePickerContextValue } from './use-date-picker';

const DATE_PICKER_SLOTS = [
  'root',
  'control',
  'input',
  'trigger',
  'content',
  'header',
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

const ACCENT = 'var(--chakra-colors-teal-500, #319795)';
const ACCENT_LIGHT = 'var(--chakra-colors-teal-100, rgba(56, 178, 172, 0.35))';
const SURFACE = 'var(--chakra-colors-bg, var(--chakra-colors-white, #ffffff))';
const SURFACE_MUTED = 'var(--chakra-colors-bg-muted, rgba(247, 250, 252, 1))';
const SURFACE_ELEVATED = 'var(--chakra-colors-bg-elevated, #ffffff)';
const BORDER = 'var(--chakra-colors-border, rgba(203, 213, 225, 0.8))';
const TEXT = 'var(--chakra-colors-fg, #1a202c)';
const TEXT_MUTED = 'var(--chakra-colors-fg-muted, rgba(100, 116, 139, 1))';

const defaultStyles: DatePickerStyles = {
  root: {
    position: 'relative',
    color: TEXT,
    fontSize: '0.875rem',
  },
  control: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: `1px solid ${BORDER}`,
    borderRadius: '0.75rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    background: SURFACE,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:focus-within': {
      borderColor: ACCENT,
      boxShadow: `0 0 0 1px ${ACCENT}`,
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
    borderRadius: '0.5rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    color: TEXT_MUTED,
    transition: 'color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      color: TEXT,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
  },
  content: {
    marginTop: '0.5rem',
    background: SURFACE_ELEVATED,
    border: `1px solid ${BORDER}`,
    borderRadius: '1rem',
    boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.15)',
    padding: '1rem',
    minWidth: '18rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    width: '100%',
    marginBottom: '0.75rem',
  },
  month: {
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    border: `1px solid ${BORDER}`,
    background: SURFACE_MUTED,
  },
  year: {
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    border: `1px solid ${BORDER}`,
    background: SURFACE_MUTED,
  },
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.25rem',
    fontSize: '0.625rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: TEXT_MUTED,
  },
  weekday: {
    textAlign: 'center',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.25rem',
  },
  day: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    height: '2.5rem',
    fontWeight: 500,
    transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
    border: '1px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(148, 163, 184, 0.2)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
    '&[data-selected="true"]': {
      background: ACCENT,
      color: 'var(--chakra-colors-white, #fff)',
      borderColor: ACCENT,
    },
    '&[data-in-range="true"]': {
      background: ACCENT_LIGHT,
      color: TEXT,
    },
    '&[data-today="true"]': {
      borderColor: ACCENT,
    },
    '&[data-outside="true"]': {
      color: TEXT_MUTED,
    },
    '&[disabled]': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
  time: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  timeInput: {
    flex: 1,
    maxWidth: '8rem',
    borderRadius: '0.5rem',
    border: `1px solid ${BORDER}`,
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    background: SURFACE,
    fontVariantNumeric: 'tabular-nums',
    '&:focus-visible': {
      outline: 'none',
      borderColor: ACCENT,
      boxShadow: `0 0 0 2px ${ACCENT_LIGHT}`,
    },
  },
  footer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
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

export interface DatePickerProps
  extends UseDatePickerProps,
    Omit<DivProps, 'children'> {
  children?: React.ReactNode;
  yearRange?: { start: number; end: number };
  styles?: Partial<DatePickerStyles>;
}

export const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
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
  },
);
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

    const monthOptions = React.useMemo(
      () =>
        api.monthNames ??
        Array.from({ length: 12 }).map((_, index) =>
          monthFormatter.format(new Date(2020, index, 1)),
        ),
      [api.monthNames, monthFormatter],
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

    return (
      <chakra.div
        ref={ref}
        className={cx('chakra-date-picker__header', className)}
        css={styles.header}
        style={style}
        {...rest}
      >
        <HStack justify="space-between" align="center" w="full" gap={2}>
          <IconButton
            aria-label="Previous month"
            size="sm"
            variant="ghost"
            {...api.getPrevTriggerProps()}
          >
            <ChevronLeftIcon />
          </IconButton>
          <HStack gap={2} flex="1" justify="center">
            <chakra.select
              className="chakra-date-picker__month-select"
              css={styles.month}
              {...monthSelectProps}
            >
              {monthOptions.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </chakra.select>
            <chakra.select
              className="chakra-date-picker__year-select"
              css={styles.year}
              {...yearSelectProps}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </chakra.select>
          </HStack>
          <IconButton
            aria-label="Next month"
            size="sm"
            variant="ghost"
            {...api.getNextTriggerProps()}
          >
            <ChevronRightIcon />
          </IconButton>
        </HStack>
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
          {api.weeks.map((week, weekIndex) => (
            <chakra.div role="row" key={weekIndex} className="chakra-date-picker__week">
              {week.map((day) => (
                <DatePickerDayCell key={day.date.toISOString()} day={day} />
              ))}
            </chakra.div>
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
        <Button size="sm" variant="ghost" onClick={() => api.clear()} disabled={!api.hasSelectedDate}>
          Clear
        </Button>
        <Button size="sm" colorPalette="teal" onClick={() => api.close()}>
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
