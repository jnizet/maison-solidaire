import { Directive, effect, ElementRef, input } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Directive({
  selector: '[msMarkdown]',
  standalone: true
})
export class MarkdownDirective {
  markdown = input.required<string>({
    alias: 'msMarkdown'
  });

  constructor(element: ElementRef, markdownService: MarkdownService) {
    effect(() => {
      element.nativeElement.innerHTML = markdownService.render(this.markdown());
    });
  }
}
