import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Week } from './weekly-schedule.service';
import { formatDate } from '@angular/common';
import { addDays, parseISO } from 'date-fns';

@Pipe({
  name: 'week',
  standalone: true
})
export class WeekPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(week: Week): string {
    const start = formatDate(week, 'mediumDate', this.locale);
    const end = formatDate(addDays(parseISO(week), 6), 'mediumDate', this.locale);
    return `du ${start} au ${end}`;
  }
}
