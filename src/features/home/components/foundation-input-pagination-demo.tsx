'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
  TimePicker,
  TimeRangePicker,
} from '@/components/shared/date-time-picker';
import { Pagination } from '@/components/shared/pagination';
import { Input, InputNumber, PasswordInput, SearchInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dayjs, type Dayjs } from '@/lib/date-time';

export function FoundationInputPaginationDemo() {
  const t = useTranslations('Home.controls');
  const [page, setPage] = useState(4);
  const [date, setDate] = useState<Dayjs | null>(dayjs('2026-09-01'));
  const [time, setTime] = useState<Dayjs | null>(dayjs('2026-09-01T09:30'));
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs('2026-09-01T09:30'));
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-09-01'),
    dayjs('2026-09-07'),
  ]);
  const [dateTimeRange, setDateTimeRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-09-01T09:30'),
    dayjs('2026-09-01T11:00'),
  ]);
  const [timeRange, setTimeRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-09-01T09:30'),
    dayjs('2026-09-01T11:00'),
  ]);
  const selectOptions = [
    { value: 'draft', label: t('select.options.draft') },
    { value: 'review', label: t('select.options.review') },
    { value: 'published', label: t('select.options.published') },
    { value: 'archived', label: t('select.options.archived') },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('text.label')} htmlFor="demo-text">
          <Input id="demo-text" placeholder={t('text.placeholder')} allowClear />
        </Field>
        <Field label={t('number.label')} htmlFor="demo-number">
          <InputNumber id="demo-number" min={0} max={1000} step={1} defaultValue={24} controls />
        </Field>
        <Field label={t('password.label')} htmlFor="demo-password">
          <PasswordInput id="demo-password" placeholder={t('password.placeholder')} allowClear />
        </Field>
        <Field label={t('search.label')} htmlFor="demo-search">
          <SearchInput id="demo-search" placeholder={t('search.placeholder')} allowClear enterButton={t('search.action')} />
        </Field>
        <Field label={t('select.single')} htmlFor="demo-select-single">
          <Select
            id="demo-select-single"
            defaultValue="draft"
            options={selectOptions}
            placeholder={t('select.placeholder')}
            optionFilterProp="label"
            showSearch
            allowClear
          />
        </Field>
        <Field label={t('select.multiple')} htmlFor="demo-select-multiple">
          <Select
            id="demo-select-multiple"
            mode="multiple"
            defaultValue={['review', 'published']}
            options={selectOptions}
            placeholder={t('select.placeholder')}
            optionFilterProp="label"
            maxTagCount="responsive"
            tagColors={{
              draft: 'default',
              review: 'gold',
              published: 'green',
              archived: 'purple',
            }}
            showSearch
            allowClear
          />
        </Field>
        <Field label={t('textarea.label')} htmlFor="demo-textarea" className="md:col-span-2">
          <Textarea id="demo-textarea" placeholder={t('textarea.placeholder')} maxLength={240} showCount autoSize={{ minRows: 3, maxRows: 6 }} />
        </Field>
        <DatePicker label={t('date.label')} value={date} onChange={setDate} />
        <TimePicker label={t('time.label')} value={time} onChange={setTime} />
        <DateTimePicker
          label={t('dateTime.label')}
          description={t('dateTime.hint')}
          value={dateTime}
          onChange={setDateTime}
        />
        <DateRangePicker
          label={t('dateRange.label')}
          value={dateRange}
          onChange={setDateRange}
          presets={[
            { label: t('picker.today'), value: [dayjs().startOf('day'), dayjs().endOf('day')] },
            { label: t('picker.nextSevenDays'), value: [dayjs().startOf('day'), dayjs().add(6, 'day').endOf('day')] },
            { label: t('picker.thisMonth'), value: [dayjs().startOf('month'), dayjs().endOf('month')] },
          ]}
        />
        <div className="md:col-span-2">
          <DateTimeRangePicker
            label={t('dateTimeRange.label')}
            description={t('dateTimeRange.hint')}
            value={dateTimeRange}
            onChange={setDateTimeRange}
          />
        </div>
        <div className="md:col-span-2">
          <TimeRangePicker
            label={t('timeRange.label')}
            description={t('timeRange.hint')}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </div>
      <div className="space-y-3 border-t pt-6">
        <div>
          <h3 className="text-sm font-semibold">{t('pagination.title')}</h3>
          <p className="text-muted-foreground text-sm">{t('pagination.current', { page })}</p>
        </div>
        <Pagination
          currentPage={page}
          totalPages={12}
          onPageChange={setPage}
          labels={{
            navigation: t('pagination.navigation'),
            previous: t('pagination.previous'),
            next: t('pagination.next'),
            page: (pageNumber) => t('pagination.page', { page: pageNumber }),
            more: t('pagination.more'),
          }}
        />
      </div>
    </div>
  );
}

function Field({ children, className, htmlFor, label }: { children: React.ReactNode; className?: string; htmlFor: string; label: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
