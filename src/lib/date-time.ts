import dayjsFactory, { type Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsFactory.extend(localizedFormat);
dayjsFactory.extend(utc);
dayjsFactory.extend(timezone);

export const dayjs = dayjsFactory;
export type { Dayjs };

export function localDateTimeToUtcIso(value: Dayjs, timeZone: string) {
  return value.tz(timeZone, true).utc().toISOString();
}

export function utcIsoToLocalDateTime(value: string, timeZone: string) {
  return dayjs.utc(value).tz(timeZone);
}
