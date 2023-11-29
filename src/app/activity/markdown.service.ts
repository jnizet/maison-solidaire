import { Injectable } from '@angular/core';
import { marked, Renderer } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    // Override function
    const renderer: Partial<Renderer> = {
      heading(text, level) {
        const renderedLevel = Math.min(level + 2, 6);
        return `<h${renderedLevel}>${text}</h${renderedLevel}>`;
      }
    };
    marked.use({ renderer });
  }

  render(markdown: string): string {
    return marked.parse(markdown) as string;
  }
}
