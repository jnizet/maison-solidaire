import { Injectable } from '@angular/core';
import { concat, delay, Observable, of, Subject, switchMap } from 'rxjs';

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
}
