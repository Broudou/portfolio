import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

/**
 * Sanitize schema = rehype-sanitize's default (strips scripts, event
 * handlers, etc.) plus the `className` attributes rehype-highlight adds to
 * `code`/`span` for syntax highlighting, and a handful of GFM elements
 * (task-list checkboxes, tables) remark-gfm can emit.
 */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
    input: [...(defaultSchema.attributes?.input ?? []), 'type', 'checked', 'disabled'],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), 'input'],
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeSanitize, schema)
  .use(rehypeStringify);

/**
 * Renders raw markdown (as stored in Mongo `*Markdown` fields) to sanitized
 * HTML. Used both for public article/biography pages and the admin's live
 * markdown preview, so the two always agree on output.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
