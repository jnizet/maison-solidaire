import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Spinner } from '../../shared/spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../toast/toast.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  OperatorFunction,
  switchMap,
  tap
} from 'rxjs';
import {
  Responsibility,
  ResponsibilityCommand,
  ResponsibilityService
} from '../../shared/responsibility.service';
import { Contact, ContactService } from '../../shared/contact.service';
import { PageTitleDirective } from '../../page-title/page-title.directive';
import { IconDirective } from '../../icon/icon.directive';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { ValidationErrorDirective, ValidationErrorsComponent } from 'ngx-valdemort';
import * as icons from '../../icon/icons';
import { SpinningIconComponent } from '../../shared/spinning-icon/spinning-icon.component';
import { toSignal } from '@angular/core/rxjs-interop';

interface ViewModel {
  editedResponsibility: Responsibility;
}

@Component({
  selector: 'ms-responsibility-edition',
  standalone: true,
  imports: [
    PageTitleDirective,
    IconDirective,
    LoadingSpinnerComponent,
    NgbTypeahead,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    RouterLink,
    CdkDragHandle,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    SpinningIconComponent
  ],
  templateUrl: './responsibility-edition.component.html',
  styleUrls: ['./responsibility-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilityEditionComponent {
  private fb = inject(NonNullableFormBuilder);
  readonly form = this.fb.group({
    contacts: this.fb.control<Array<Contact>>([], Validators.required)
  });
  readonly icons = icons;
  readonly saving = new Spinner();

  readonly vm: Signal<ViewModel | undefined>;

  readonly contactFormControl = new FormControl('');
  readonly contactFormatter = (contact: Contact) => contact.name;

  readonly contactTypeahead: OperatorFunction<string, Array<Contact>> = text$ =>
    combineLatest([
      text$.pipe(
        map(text => text.toLowerCase()),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.contactService.list()
    ]).pipe(
      map(([text, contacts]) =>
        contacts
          .filter(
            c => this.contacts.every(resp => resp.id != c.id) && c.name.toLowerCase().includes(text)
          )
          .slice(0, 10)
      )
    );

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private responsibilityService: ResponsibilityService,
    private contactService: ContactService,
    private toastService: ToastService
  ) {
    this.vm = toSignal(
      route.paramMap.pipe(
        map(paramMap => paramMap.get('responsibilitySlug')),
        switchMap(responsibilitySlug => responsibilityService.getBySlug(responsibilitySlug!)),
        first(),
        tap(responsibility => {
          this.form.setValue({
            contacts: responsibility.contacts
          });
        }),
        map(responsibility => ({ editedResponsibility: responsibility }))
      )
    );
  }

  save() {
    if (!this.form.valid) {
      return;
    }
    const command: ResponsibilityCommand = {
      contacts: this.form.controls.contacts.value.map(c => c.id)
    };
    const vm = this.vm()!;
    this.responsibilityService
      .update(vm.editedResponsibility.id, command)
      .pipe(this.saving.spinUntilFinalization())
      .subscribe(() => {
        this.router.navigate(['/responsibilities']);
        this.toastService.success('Responsabilité modifiée');
      });
  }

  removeContact(contact: Contact) {
    this.form.controls.contacts.setValue(this.contacts.filter(c => c != contact));
    this.form.controls.contacts.markAsTouched();
  }

  selectContact($event: NgbTypeaheadSelectItemEvent<Contact>) {
    this.form.controls.contacts.setValue([...this.contacts, $event.item]);
    $event.preventDefault();
    this.contactFormControl.setValue('');
  }

  drop(event: CdkDragDrop<Array<Contact>, unknown>) {
    const contacts = [...this.contacts];
    moveItemInArray(contacts, event.previousIndex, event.currentIndex);
    this.form.controls.contacts.setValue(contacts);
  }

  get contacts() {
    return this.form.controls.contacts.value;
  }
}
