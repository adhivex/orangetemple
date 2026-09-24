import MarkdownIt from 'markdown-it'

/*
 * The single Markdown renderer (D-003). Server-side only.
 * - html: false escapes any raw HTML in content instead of rendering it.
 * - markdown-it's default link validation rejects javascript:, vbscript:, file: and
 *   most data: URLs.
 * - Headings are shifted so content can never emit an <h1> or <h2>: page sections own
 *   those levels, and content headings start at <h3>.
 * - External links open with rel="noopener noreferrer".
 */
const md = new MarkdownIt({ html: false, linkify: false, typographer: true, breaks: false })

md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]!
  const level = Math.min(Math.max(Number(token.tag.slice(1)) + 2, 3), 6)
  token.tag = `h${level}`
  const close = tokens.find((t, i) => i > idx && t.type === 'heading_close')
  if (close) close.tag = token.tag
  return self.renderToken(tokens, idx, options)
}

const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!
  const href = String(token.attrGet('href') ?? '')
  if (/^https?:\/\//i.test(href)) token.attrSet('rel', 'noopener noreferrer')
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function renderMarkdown(source: string): string {
  return md.render(source)
}
