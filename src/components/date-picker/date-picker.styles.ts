import { anatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { mode, transparentize } from '@chakra-ui/theme-tools';

export const datePickerAnatomy = anatomy('date-picker').parts(
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
);

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  datePickerAnatomy.keys,
);

const baseStyle = definePartsStyle((props) => {
  const { colorScheme = 'teal', theme } = props;
  const bg = mode('white', 'gray.800')(props);
  const border = mode('gray.200', 'whiteAlpha.300')(props);
  const placeholder = mode('gray.500', 'whiteAlpha.600')(props);
  const text = mode('gray.700', 'gray.100')(props);
  const hoverDay = mode('gray.100', 'whiteAlpha.200')(props);
  const selectedBg = mode(`${colorScheme}.500`, `${colorScheme}.300`)(props);
  const selectedColor = mode('white', 'gray.900')(props);
  const rangeBg = mode(
    `${colorScheme}.100`,
    transparentize(`${colorScheme}.300`, 0.65)(theme),
  )(props);
  const todayBorder = mode(`${colorScheme}.500`, `${colorScheme}.300`)(props);

  return {
    root: {
      position: 'relative',
      color: text,
      fontSize: 'sm',
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderWidth: '1px',
      borderColor: border,
      borderRadius: 'md',
      px: 3,
      py: 2,
      transitionProperty: 'common',
      transitionDuration: 'normal',
      _focusWithin: {
        borderColor: `${colorScheme}.500`,
        boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-500)`,
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
      borderRadius: 'md',
      px: 2,
      py: 1,
      color: mode('gray.600', 'gray.300')(props),
      transitionProperty: 'background, color, transform',
      transitionDuration: 'fast',
      _hover: { color: mode('gray.800', 'whiteAlpha.900')(props) },
      _active: { transform: 'translateY(1px)' },
      _focusVisible: {
        outline: 'none',
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    content: {
      mt: 2,
      bg,
      borderWidth: '1px',
      borderColor: border,
      borderRadius: 'lg',
      boxShadow: 'xl',
      p: 4,
      zIndex: 'dropdown',
      minW: 'xs',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      w: 'full',
      mb: 3,
      gap: 2,
    },
    month: {
      borderRadius: 'md',
      fontSize: 'sm',
      px: 2,
      py: 1,
      bg: mode('gray.50', 'whiteAlpha.100')(props),
      borderWidth: '1px',
      borderColor: border,
      cursor: 'pointer',
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    year: {
      borderRadius: 'md',
      fontSize: 'sm',
      px: 2,
      py: 1,
      bg: mode('gray.50', 'whiteAlpha.100')(props),
      borderWidth: '1px',
      borderColor: border,
      cursor: 'pointer',
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    calendar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1,
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'widest',
      color: mode('gray.500', 'gray.400')(props),
    },
    weekday: {
      textAlign: 'center',
      fontWeight: 'semibold',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1,
    },
    day: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'md',
      h: 10,
      fontWeight: 'medium',
      transitionProperty: 'common',
      transitionDuration: 'fast',
      _hover: { bg: hoverDay },
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      '&[data-selected="true"]': {
        bg: selectedBg,
        color: selectedColor,
        _hover: { bg: selectedBg },
      },
      '&[data-in-range="true"]': {
        bg: rangeBg,
        color: mode(`${colorScheme}.800`, 'white')(props),
      },
      '&[data-today="true"]': {
        borderWidth: '1px',
        borderColor: todayBorder,
      },
      '&[data-outside="true"]': {
        color: mode('gray.400', 'whiteAlpha.500')(props),
      },
    },
    time: {
      mt: 4,
      alignItems: 'center',
    },
    timeInput: {
      flex: 1,
      maxW: '8rem',
      borderRadius: 'md',
      borderWidth: '1px',
      borderColor: border,
      px: 3,
      py: 2,
      bg: 'transparent',
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-${colorScheme}-200)`,
      },
    },
    footer: {
      mt: 4,
    },
  };
});

const sizes = {
  sm: definePartsStyle({
    control: { py: 1.5, px: 2, borderRadius: 'md' },
    content: { p: 3 },
    day: { h: 8, fontSize: 'sm' },
  }),
  md: definePartsStyle({}),
  lg: definePartsStyle({
    control: { py: 2.5, px: 3 },
    content: { p: 5 },
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
