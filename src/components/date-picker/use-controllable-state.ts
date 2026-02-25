import React from 'react';

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (next: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as T) : uncontrolledValue;

  const valueRef = React.useRef(currentValue);
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    valueRef.current = currentValue;
  }, [currentValue]);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setValue = React.useCallback(
    (next: T) => {
      const previous = valueRef.current;

      if (!isControlled) {
        setUncontrolledValue(next);
        valueRef.current = next;
      }

      if (!Object.is(previous, next)) {
        onChangeRef.current?.(next);
      }
    },
    [isControlled],
  );

  return [currentValue, setValue];
}

export default useControllableState;
