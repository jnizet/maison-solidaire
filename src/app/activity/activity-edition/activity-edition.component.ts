import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Spinner } from '../../shared/spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../toast/toast.service';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';
import { Activity, ActivityCommand, ActivityService } from '../activity.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { ValidationErrorsComponent } from 'ngx-valdemort';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLink,
  NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { MarkdownDirective } from '../markdown.directive';
import * as icons from '../../icon/icons';
import { FormControlValidationDirective } from '../../validation/form-control-validation.directive';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  mode: 'create' | 'edit';
  editedActivity?: Activity;
}

@Component({
  selector: 'ms-activity-edition',
  standalone: true,
  imports: [
    PageTitleDirective,
    ReactiveFormsModule,
    ValidationErrorsComponent,
    FormControlValidationDirective,
    IconDirective,
    RouterLink,
    LoadingSpinnerComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    MarkdownDirective,
    NgbNavOutlet,
    SpinningIconComponent,
    AsyncPipe
  ],
  templateUrl: './activity-edition.component.html',
  styleUrls: ['./activity-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityEditionComponent {
  form = this.fb.group({
    title: ['', Validators.required],
    date: this.fb.control<string | null>(null, Validators.required),
    description: ['', Validators.required]
  });

  vm$: Observable<ViewModel>;
  icons = icons;
  saving = new Spinner();

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService
  ) {
    this.vm$ = route.paramMap.pipe(
      map(paramMap => paramMap.get('activityId')),
      switchMap(activityId => (activityId ? activityService.get(activityId) : of(undefined))),
      first(),
      tap(activity => {
        if (activity) {
          const formValue = {
            title: activity.title,
            description: activity.description,
            date: activity.date
          };

          this.form.setValue(formValue);
        }
      }),
      map(activity => ({
        mode: activity ? 'edit' : 'create',
        editedActivity: activity
      }))
    );
  }

  save(vm: ViewModel) {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const command: ActivityCommand = {
      title: formValue.title,
      description: formValue.description,
      date: formValue.date!
    };
    const result$: Observable<unknown> =
      vm.mode === 'create'
        ? this.activityService.create(command)
        : this.activityService.update(vm.editedActivity!.id, command);
    result$.pipe(this.saving.spinUntilFinalization()).subscribe(() => {
      this.router.navigate(['/activities']);
      this.toastService.success(vm.mode === 'create' ? 'Activité crééé' : 'Activité modifiée');
    });
  }
}
