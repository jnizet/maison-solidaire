import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Directive({
  selector: '[msMarkdown]',
  standalone: true
})
export class MarkdownDirective implements OnChanges {
  @Input('msMarkdown') markdown!: string;

  constructor(private element: ElementRef, private markdownService: MarkdownService) {}

  ngOnChanges() {
    this.element.nativeElement.innerHTML = this.markdownService.render(this.markdown);
  }
}
