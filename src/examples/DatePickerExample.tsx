import { CalendarIcon } from '../components/icons';
import {
  Box,
  ChakraProvider,
  Heading,
  Stack,
  Text,
  VStack,
  defaultSystem,
} from '@chakra-ui/react';
import React from 'react';
import { DatePicker, DateRangeValue } from '../components/date-picker';

const ControlledDatePicker = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <Box>
      <Heading as="h3" size="sm" mb={2}>
        Controlled date with time selection
      </Heading>
      <DatePicker value={value} onChange={(next) => setValue(next as Date)} enableTimeSelection>
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.Trigger aria-label="Open calendar">
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Content />
      </DatePicker>
      <Text mt={2} fontSize="sm">
        Selected: {value ? value.toLocaleString() : 'none'}
      </Text>
    </Box>
  );
};

const RangeDatePicker = () => {
  const [range, setRange] = React.useState<DateRangeValue>({ start: null, end: null });

  return (
    <Box>
      <Heading as="h3" size="sm" mb={2}>
        Range selection
      </Heading>
      <DatePicker isRange value={range} onChange={(next) => setRange(next as DateRangeValue)}>
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.Trigger aria-label="Select date range">
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Content />
      </DatePicker>
      <Text mt={2} fontSize="sm">
        {range.start ? range.start.toLocaleDateString() : 'Start'} –{' '}
        {range.end ? range.end.toLocaleDateString() : 'End'}
      </Text>
    </Box>
  );
};

export const DatePickerExample = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <VStack gap={8} align="stretch" maxW="lg" mx="auto" py={10} px={6}>
        <Heading as="h1" size="lg">
          Chakra UI v3 DatePicker
        </Heading>
        <Text color="gray.500">
          This example demonstrates how to use the DatePicker component in both single-date and
          range modes, including a controlled setup.
        </Text>
        <Stack gap={8}>
          <ControlledDatePicker />
          <RangeDatePicker />
        </Stack>
      </VStack>
    </ChakraProvider>
  );
};

export default DatePickerExample;
