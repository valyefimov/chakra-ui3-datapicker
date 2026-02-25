const datePickerParts = [
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

type DatePickerSlot = (typeof datePickerParts)[number];

type StyleObject = Record<string, unknown>;
type SlotStyles = Partial<Record<DatePickerSlot, StyleObject>>;
type ColorMode = 'light' | 'dark';

interface DatePickerStyleProps {
  colorScheme?: string;
  colorMode?: ColorMode;
  theme?: unknown;
}

type SlotStyleConfig = SlotStyles | ((props: DatePickerStyleProps) => SlotStyles);

interface DatePickerThemeConfig {
  slots: readonly DatePickerSlot[];
  baseStyle: SlotStyleConfig;
  sizes: Record<string, SlotStyleConfig>;
  variants: Record<string, SlotStyleConfig>;
  defaultProps: {
    size: string;
    variant: string;
    colorScheme: string;
  };
}

export const datePickerAnatomy = {
  keys: datePickerParts,
};

const definePartsStyle = (style: SlotStyleConfig) => style;

const defineMultiStyleConfig = (
  config: Omit<DatePickerThemeConfig, 'slots'>,
): DatePickerThemeConfig => ({
  ...config,
  slots: datePickerAnatomy.keys,
});

const mode = (light: string, dark: string) => (props: DatePickerStyleProps) =>
  props.colorMode === 'dark' ? dark : light;

const transparentize = (color: string, amount: number) => (_theme?: unknown) => {
  if (color !== 'white') return color;
  const alpha = Math.max(0, Math.min(1, 1 - amount));
  return `rgba(255, 255, 255, ${alpha})`;
};

const baseStyle = definePartsStyle((props) => {
  const { colorScheme = 'teal', theme } = props;
  const surface = mode('white', '#0f1014')(props);
  const surfaceMuted = mode('gray.100', 'rgba(255, 255, 255, 0.06)')(props);
  const border = mode('gray.200', 'rgba(255, 255, 255, 0.08)')(props);
  const borderSoft = mode('gray.100', 'rgba(255, 255, 255, 0.06)')(props);
  const placeholder = mode('gray.500', 'rgba(244, 244, 245, 0.68)')(props);
  const text = mode('gray.800', 'rgba(244, 244, 245, 0.97)')(props);
  const textMuted = mode('gray.600', 'rgba(244, 244, 245, 0.68)')(props);
  const textSubtle = mode('gray.500', 'rgba(244, 244, 245, 0.42)')(props);
  const hoverBg = mode('gray.100', 'rgba(244, 244, 245, 0.1)')(props);
  const selectedColor = mode('white', 'rgba(244, 244, 245, 0.92)')(props);
  const rangeBg = mode(`${colorScheme}.100`, transparentize('white', 0.88)(theme))(props);
  const todayBorder = mode(`${colorScheme}.500`, 'rgba(244, 244, 245, 0.18)')(props);

  return {
    root: {
      position: 'relative',
      color: text,
      fontSize: 'sm',
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      borderWidth: '1px',
      borderColor: borderSoft,
      borderRadius: '2xl',
      px: 4,
      py: 3,
      bg: surface,
      transitionProperty: 'common',
      transitionDuration: 'normal',
      _hover: { borderColor: mode('gray.300', 'rgba(244, 244, 245, 0.22)')(props) },
      _focusWithin: {
        borderColor: mode(`${colorScheme}.500`, 'rgba(148, 163, 184, 0.45)')(props),
        boxShadow: mode(
          `0 0 0 1px var(--chakra-colors-${colorScheme}-500)`,
          '0 0 0 1px rgba(148, 163, 184, 0.45)',
        )(props),
      },
    },
    input: {
      flex: 1,
      bg: 'transparent',
      border: 0,
      outline: 0,
      fontSize: 'sm',
      color: 'inherit',
      _placeholder: { color: placeholder },
      _focus: { outline: 'none' },
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'lg',
      px: 2,
      py: 1.5,
      color: textMuted,
      bg: surfaceMuted,
      transitionProperty: 'background, color',
      transitionDuration: 'fast',
      _hover: { color: text, bg: hoverBg },
      _active: { transform: 'translateY(1px)' },
      _focusVisible: {
        outline: 'none',
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    content: {
      mt: 2,
      bg: surface,
      borderWidth: '1px',
      borderColor: border,
      borderRadius: '3xl',
      boxShadow: mode('xl', '0 32px 70px rgba(2, 6, 23, 0.6)')(props),
      px: 7,
      py: 7,
      zIndex: 'dropdown',
      minW: 'sm',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      w: 'full',
      mb: 5,
      gap: 3,
    },
    navButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      w: 10,
      h: 10,
      borderRadius: 'full',
      color: text,
      bg: 'transparent',
      transitionProperty: 'background, color, transform',
      transitionDuration: 'fast',
      _hover: { bg: hoverBg },
      _active: { transform: 'translateY(1px)' },
      _focusVisible: {
        outline: 'none',
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    monthLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: 'xl',
      fontWeight: 'semibold',
      letterSpacing: '-0.01em',
      color: text,
    },
    month: {
      position: 'absolute',
      w: '1px',
      h: '1px',
      p: 0,
      m: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    year: {
      position: 'absolute',
      w: '1px',
      h: '1px',
      p: 0,
      m: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    calendar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'widest',
      color: textSubtle,
    },
    weekday: {
      textAlign: 'center',
      fontWeight: 'semibold',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
    },
    day: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      h: 10,
      minW: 10,
      fontWeight: 'medium',
      fontSize: 'sm',
      transitionProperty: 'common',
      transitionDuration: 'fast',
      color: text,
      _hover: { bg: hoverBg },
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      '&[data-selected="true"]': {
        bg: mode(`${colorScheme}.500`, 'rgba(148, 163, 184, 0.3)')(props),
        borderWidth: '1px',
        borderColor: mode(`${colorScheme}.600`, 'rgba(244, 244, 245, 0.42)')(props),
        color: selectedColor,
        boxShadow: mode('none', 'inset 0 -1px 0 0 rgba(244, 244, 245, 0.6)')(props),
      },
      '&[data-in-range="true"]': {
        bg: rangeBg,
        color: mode(`${colorScheme}.800`, text)(props),
      },
      '&[data-today="true"]': {
        borderWidth: '1px',
        borderColor: todayBorder,
        fontWeight: 'semibold',
      },
      '&[data-today="true"][data-selected="true"]': {
        bg: mode(
          `${colorScheme}.600`,
          'linear-gradient(180deg, rgba(148, 163, 184, 0.44), rgba(148, 163, 184, 0.3))',
        )(props),
        borderColor: mode(`${colorScheme}.700`, 'rgba(244, 244, 245, 0.68)')(props),
        boxShadow: mode(
          'none',
          '0 0 0 1px rgba(244, 244, 245, 0.28), 0 8px 16px rgba(2, 6, 23, 0.3)',
        )(props),
      },
      '&[data-outside="true"]': {
        color: mode('gray.400', textSubtle)(props),
      },
    },
    time: {
      mt: 6,
      alignItems: 'center',
    },
    timeInput: {
      flex: 1,
      maxW: '8rem',
      borderRadius: 'lg',
      borderWidth: '1px',
      borderColor: borderSoft,
      px: 3,
      py: 2,
      bg: 'transparent',
      color: text,
      _placeholder: { color: textMuted },
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    footer: {
      mt: 6,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };
});

const sizes = {
  sm: definePartsStyle({
    control: { py: 2, px: 3, borderRadius: 'lg' },
    content: { p: 4 },
    day: { h: 9, fontSize: 'sm' },
  }),
  md: definePartsStyle({}),
  lg: definePartsStyle({
    control: { py: 4, px: 5 },
    content: { p: 7 },
    day: { h: 12, fontSize: 'md' },
  }),
};

const variants = {
  subtle: definePartsStyle((props) => ({
    control: {
      bg: mode('gray.50', 'whiteAlpha.100')(props),
      _hover: { bg: mode('gray.100', 'whiteAlpha.200')(props) },
    },
    content: {
      borderColor: mode('gray.100', 'whiteAlpha.200')(props),
    },
  })),
  outline: definePartsStyle({
    control: {
      bg: 'transparent',
    },
  }),
};

export const datePickerTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: 'md',
    variant: 'subtle',
    colorScheme: 'teal',
  },
});

export default datePickerTheme;
