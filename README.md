# Chakra UI v3 Date Picker

A headless-ready, accessible date picker built for Chakra UI v3. The package exposes a composable `DatePicker` component with Chakra-styled slots, a fully typed `useDatePicker` hook, and theming utilities so you can drop rich date selection into any Chakra-powered experience.

> ⚠️ **Chakra UI v3 required.** Earlier Chakra major versions expose different APIs and are not compatible with this package.

## Features

- ✅ Single-date and date-range selection
- ✅ Optional time input for timestamp workflows
- ✅ Controlled & uncontrolled usage with full TypeScript support
- ✅ Keyboard navigation, outside-click dismissal, and focus management baked in
- ✅ Slot-based styling API (`styles` prop) plus theme helpers for deeper customisation
- ✅ Zero dependency on `@chakra-ui/icons` – lightweight inline SVG icons included

## Installation

```bash
npm install chakra-ui3-datepicker @chakra-ui/react @chakra-ui/anatomy @chakra-ui/styled-system @chakra-ui/utils @chakra-ui/react-use-controllable-state
```

You also need the Chakra UI v3 peer dependencies (`@emotion/react`, `react`, `react-dom`). Follow the [official Chakra UI v3 installation guide](https://next.chakra-ui.com/docs/getting-started) if you are starting from scratch.

## Quick Start

```tsx
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { DatePicker } from 'chakra-ui3-datepicker';
import React from 'react';

enum Mode {
  Single = 'single',
  Range = 'range',
}

export function App() {
  const [selectionMode, setSelectionMode] = React.useState<Mode>(Mode.Single);
  const [singleDate, setSingleDate] = React.useState<Date | null>(new Date());
  const [range, setRange] = React.useState({ start: null as Date | null, end: null as Date | null });

  return (
    <ChakraProvider value={defaultSystem}>
      <DatePicker
        isRange={selectionMode === Mode.Range}
        value={selectionMode === Mode.Range ? range : singleDate}
        onChange={(next) => {
          if (selectionMode === Mode.Range) {
            setRange(next as typeof range);
          } else {
            setSingleDate(next as Date | null);
          }
        }}
        enableTimeSelection
      />
    </ChakraProvider>
  );
}
```

The component ships with sensible styling out of the box. If you prefer a headless approach, see [Customising Styles](#customising-styles).

## Component Anatomy

The date picker exposes a root component plus slot components so you can compose bespoke UIs or replace individual pieces:

```tsx
<DatePicker>
  <DatePicker.Control>
    <DatePicker.Input />
    <DatePicker.Trigger />
  </DatePicker.Control>
  <DatePicker.Content>
    <DatePicker.Header />
    <DatePicker.Calendar />
    <DatePicker.TimeField />
    <DatePicker.Footer />
  </DatePicker.Content>
</DatePicker>
```

Every slot forwards Chakra-compatible props and refs, so you can attach handlers, tweak spacing, or replace markup as needed.

## Props Reference

`DatePicker` extends both the hook configuration and standard `div` attributes (with conflicting form props omitted). Key props include:

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `isRange` | `boolean` | Enables range selection mode when `true`. |
| `value` | `Date \| null \| { start: Date \| null; end: Date \| null }` | Controlled value. Send either a single date or a range depending on `isRange`. |
| `defaultValue` | Same as `value` | Uncontrolled initial value. |
| `onChange` | `(value) => void` | Receives the new selection (single date or range). |
| `enableTimeSelection` | `boolean` | Adds a time input beneath the calendar grid. |
| `timeValue` / `defaultTimeValue` | `string (HH:MM)` | Controlled or initial time value when `enableTimeSelection` is set. |
| `onTimeChange` | `(time: string) => void` | Notified with the updated time string. |
| `minDate` / `maxDate` | `Date` | Clamp selectable dates to the provided range. |
| `isDateUnavailable` | `(date: Date) => boolean` | Disable specific dates dynamically. |
| `closeOnSelect` | `boolean` (default `true`) | Close the popover after a selection in single-date mode. |
| `openOnFocus` | `boolean` (default `true`) | Open the calendar when the input receives focus. |
| `styles` | `Partial<Record<Slot, SystemStyleObject>>` | Merge additional Chakra-style objects into internal slot styles. |
| `yearRange` | `{ start: number; end: number }` | Overrides the default 100-year window around the current view. |

Refer to [`src/components/date-picker/use-date-picker.tsx`](src/components/date-picker/use-date-picker.tsx) for the full list of hook options, returned helpers, and slot getters if you are building your own UI on top of the hook alone.

## Customising Styles

The component provides handcrafted defaults, but you remain in control.

### 1. Override slot styles inline

```tsx
<DatePicker
  styles={{
    control: {
      background: 'bg.muted',
      borderRadius: 'xl',
    },
    day: {
      fontWeight: 'bold',
      _hover: { background: 'teal.100' },
      '&[data-selected="true"]': {
        background: 'teal.500',
        color: 'white',
      },
    },
  }}
/>
```

### 2. Reuse the exported theme helpers

If you prefer theme-driven customisation, the original multi-part helpers are still exported:

```ts
// theme/date-picker.ts
import { datePickerTheme } from 'chakra-ui3-datepicker';

export const DatePicker = {
  ...datePickerTheme,
  defaultProps: {
    ...datePickerTheme.defaultProps,
    colorScheme: 'purple',
  },
};
```

Then merge into your Chakra system when you create it:

```ts
import { createSystem, defaultConfig, mergeConfigs } from '@chakra-ui/react';
import { DatePicker as DatePickerRecipe } from './theme/date-picker';

export const system = createSystem(
  mergeConfigs(defaultConfig, {
    theme: {
      slotRecipes: {
        datePicker: DatePickerRecipe,
      },
    },
  }),
);
```

Pass the resulting system to `ChakraProvider`:

```tsx
<ChakraProvider value={system}>…</ChakraProvider>
```

## Accessibility

- The input behaves as a combobox with correct `aria-expanded` / `aria-controls` wiring.
- Arrow keys, Home/End, PageUp/PageDown, and Enter/Space are handled for grid navigation.
- Focus is returned to the trigger after pressing `Escape`.
- Outside clicks close the popover without stealing focus from the trigger element.

## TypeScript

Everything ships with rich type definitions. Use the exported interfaces to strongly type your own wrappers:

```ts
import type { DatePickerProps, DateRangeValue } from 'chakra-ui3-datepicker';
```

## Examples

Explore the reference implementation in [`src/examples/DatePickerExample.tsx`](src/examples/DatePickerExample.tsx) for a full page demo that combines both single and range pickers, Chakra layout primitives, and live state display.

## Local Development

```bash
# install deps
npm install

# run static analysis
npm run lint
npm run typecheck

# build the library and the demo bundle
npm run build
```

The build command compiles the library via `tsup` (CJS, ESM, and type definitions) and then bundles the example site with Vite.

## Contributing

Issues and pull requests are welcome! If you add new features, include accompanying documentation updates and, where possible, unit or visual test coverage. Use `npm run lint` and `npm run typecheck` to keep the codebase healthy, and ensure `npm run build` succeeds before submitting changes.

