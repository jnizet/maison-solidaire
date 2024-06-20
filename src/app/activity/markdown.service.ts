import { Injectable } from '@angular/core';
import { marked, MarkedExtension } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    // Override function
    const extension: MarkedExtension = {
      useNewRenderer: true,
      renderer: {
        heading({ text, depth }) {
          const renderedLevel = Math.min(depth + 2, 6);
          return `<h${renderedLevel}>${text}</h${renderedLevel}>`;
        }
      }
    };
    marked.use(extension);
  }

  render(markdown: string): string {
    return marked.parse(markdown) as string;
  }
}
