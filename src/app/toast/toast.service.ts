import { Injectable } from '@angular/core';
import { concat, delay, Observable, of, Subject, switchMap } from 'rxjs';
import * as icons from '../icon/icons';

export interface Toast {
  message: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$: Observable<Toast | null>;

  constructor() {
    this.toast$ = this.toastSubject.pipe(
      switchMap(toast => concat(of(toast), of(null).pipe(delay(3000))))
    );
  }

  display(toast: Toast) {
    this.toastSubject.next(toast);
  }

  success(message: string) {
    this.toastSubject.next({
      icon: icons.success,
      message
    });
  }
}
