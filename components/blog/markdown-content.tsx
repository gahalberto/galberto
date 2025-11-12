'use client'

import { useEffect, useRef } from 'react'

interface MarkdownContentProps {
  content: string
}

// Função simples para converter Markdown básico para HTML
function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

  // Paragraphs (linhas vazias separam parágrafos)
  html = html.split('\n\n').map(para => {
    if (para.trim().startsWith('<')) {
      return para
    }
    return `<p>${para.trim()}</p>`
  }).join('\n')

  // Line breaks
  html = html.replace(/\n/gim, '<br />')

  return html
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = markdownToHtml(content)
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:text-foreground
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:text-foreground
        prose-img:rounded-lg prose-img:shadow-lg
        [&>h1]:text-3xl [&>h1]:mb-4 [&>h1]:mt-8
        [&>h2]:text-2xl [&>h2]:mb-3 [&>h2]:mt-6
        [&>h3]:text-xl [&>h3]:mb-2 [&>h3]:mt-4
        [&>p]:mb-4
        [&>ul]:mb-4 [&>ul]:pl-6
        [&>ol]:mb-4 [&>ol]:pl-6
        [&>li]:mb-2"
    />
  )
}

