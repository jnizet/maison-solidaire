import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Week } from './weekly-schedule.service';
import { formatDate } from '@angular/common';
import { addDays, parseISO } from 'date-fns';

@Pipe({
  name: 'week',
  standalone: true
})
export class WeekPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(week: Week): string {
    const start = formatDate(week, 'mediumDate', this.locale);
    const end = formatDate(addDays(parseISO(week), 6), 'mediumDate', this.locale);
    return `du ${start} au ${end}`;
  }
}
