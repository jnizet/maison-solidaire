import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeeklyScheduleService } from '../weekly-schedule.service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WeekPipe } from '../week.pipe';
import { IconDirective } from '../../icon/icon.directive';
import * as icons from '../../icon/icons';
import { Spinner } from '../../shared/spinner';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../toast/toast.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';

@Component({
  selector: 'ms-edit-weekly-schedule',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WeekPipe,
    IconDirective,
    RouterLink,
    PageTitleDirective,
    SpinningIconComponent
  ],
  templateUrl: './edit-weekly-schedule.component.html',
  styleUrls: ['./edit-weekly-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWeeklyScheduleComponent {
  readonly weeks = this.weeklyScheduleService.nextWeeks();
  form = this.fb.group({
    week: [this.weeks[1]]
  });
  readonly icons = icons;
  readonly saving = new Spinner();

  constructor(
    private fb: NonNullableFormBuilder,
    private weeklyScheduleService: WeeklyScheduleService,
    private toastService: ToastService,
    private router: Router
  ) {}

  upload(event: Event) {
    if (this.form.invalid) {
      return;
    }
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files![0];
    fileInput.value = '';
    this.weeklyScheduleService
      .uploadSchedule(file, { week: this.form.getRawValue().week })
      .pipe(this.saving.spinUntilFinalization())
      .subscribe(() => {
        this.toastService.success('Programme de la semaine enregistré');
        this.router.navigate(['/volunteering']);
      });
  }
}
