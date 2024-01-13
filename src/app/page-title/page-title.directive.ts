import { DestroyRef, Directive, effect, input } from '@angular/core';
import { Title } from '@angular/platform-browser';

const DEFAULT_TITLE = 'Maison Solidaire';

@Directive({
  selector: 'ms-page-title',
  standalone: true
})
export class PageTitleDirective {
  title = input.required<string>();

  constructor(
    private titleService: Title,
    destroyRef: DestroyRef
  ) {
    effect(() => {
      this.titleService.setTitle(`${this.title()} - ${DEFAULT_TITLE}`);
    });

    destroyRef.onDestroy(() => this.titleService.setTitle(DEFAULT_TITLE));
  }
}
