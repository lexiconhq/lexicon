import React from 'react';
import RNDateTimePicker, {
  DateTimePickerProps as RNDateTimePickerProps,
} from 'react-native-modal-datetime-picker';

type DateTimePickerMode = 'date' | 'time';

export type DateTimePickerProps = Readonly<
  Omit<RNDateTimePickerProps, 'date' | 'mode' | 'is24Hour'> & {
    title?: string;
    dateTitleWeb?: string;
    timeTitleWeb?: string;
    cancelTextWeb?: string;
    confirmTextWeb?: string;
    mode?: DateTimePickerMode;
    date?: string;
    use24Hour?: boolean;
  }
>;

export function DateTimePicker(props: DateTimePickerProps) {
  const {
    onCancel,
    onConfirm,
    date = new Date().toISOString(),
    use24Hour = false,
    mode = 'date',
    ...otherProps
  } = props;
  return (
    <RNDateTimePicker
      date={date.trim() === '' ? new Date() : new Date(date)}
      mode={mode}
      is24Hour={use24Hour}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...otherProps}
    />
  );
}
