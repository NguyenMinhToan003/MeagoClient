'use client';

import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd';
import type { DatePickerProps as AntDatePickerProps, RangePickerProps as AntRangePickerProps } from 'antd/es/date-picker';
import type { TimePickerProps as AntTimePickerProps, TimeRangePickerProps as AntTimeRangePickerProps } from 'antd/es/time-picker';
import type { Dayjs } from 'dayjs';

import { cn } from '@/lib/utils';

interface PickerTextProps {
  label: string;
  description?: string;
  className?: string;
}

type DatePickerProps = Omit<AntDatePickerProps<Dayjs, false>, 'className'> & PickerTextProps;
type DateRangePickerProps = Omit<AntRangePickerProps, 'className'> & PickerTextProps;
type TimePickerProps = Omit<AntTimePickerProps, 'className'> & PickerTextProps;
type TimeRangePickerProps = Omit<AntTimeRangePickerProps, 'className'> & PickerTextProps;

function PickerField({ children, className, description, label }: PickerTextProps & { children: React.ReactNode }) {
  return (
    <div className={cn('space-y-2', className)}>
      <span className="block text-sm font-medium">{label}</span>
      {children}
      {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
    </div>
  );
}

export function DatePicker({ className, description, label, ...props }: DatePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntDatePicker aria-label={label} className="meago-antd-picker w-full" {...props} />
    </PickerField>
  );
}

export function DateTimePicker({ className, description, label, ...props }: DatePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntDatePicker
        aria-label={label}
        className="meago-antd-picker w-full"
        showTime={{ format: 'HH:mm' }}
        needConfirm
        {...props}
      />
    </PickerField>
  );
}

export function DateRangePicker({ className, description, label, ...props }: DateRangePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntDatePicker.RangePicker aria-label={label} className="meago-antd-picker w-full" needConfirm {...props} />
    </PickerField>
  );
}

export function DateTimeRangePicker({ className, description, label, ...props }: DateRangePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntDatePicker.RangePicker
        aria-label={label}
        className="meago-antd-picker w-full"
        showTime={{ format: 'HH:mm' }}
        needConfirm
        {...props}
      />
    </PickerField>
  );
}

export function TimePicker({ className, description, label, ...props }: TimePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntTimePicker
        aria-label={label}
        className="meago-antd-picker w-full"
        format="HH:mm"
        needConfirm
        showSecond={false}
        {...props}
      />
    </PickerField>
  );
}

export function TimeRangePicker({ className, description, label, ...props }: TimeRangePickerProps) {
  return (
    <PickerField className={className} description={description} label={label}>
      <AntTimePicker.RangePicker
        aria-label={label}
        className="meago-antd-picker w-full"
        format="HH:mm"
        needConfirm
        showSecond={false}
        order
        {...props}
      />
    </PickerField>
  );
}
