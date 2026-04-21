'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useOsShortcut } from '@/hooks/use-os-shortcut'

export function HtmlEditor({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (html: string) => void
  error?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'outline-none min-h-52 px-4 py-3 text-sm [&_h2]:mb-1 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-1',
      },
    },
  })

  const { modKey, altKey, shiftKey } = useOsShortcut()

  return (
    <div
      className={cn(
        'border-input rounded-md border shadow-xs',
        error && 'border-destructive'
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
        <Button
          type="button"
          variant={editor?.isActive('bold') ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title={`Bold (${modKey}+B)`}
        >
          <BoldIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive('italic') ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title={`Italic (${modKey}+I)`}
        >
          <ItalicIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor?.isActive('heading', { level: 2 }) ? 'default' : 'ghost'
          }
          size="icon-sm"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title={`Heading 2 (${modKey}+${altKey}+2)`}
        >
          <Heading2Icon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive('bulletList') ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title={`Bullet List (${modKey}+${shiftKey}+8)`}
        >
          <ListIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive('orderedList') ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title={`Ordered List (${modKey}+${shiftKey}+7)`}
        >
          <ListOrderedIcon className="size-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />

      {error && (
        <p className="text-destructive px-3 pb-2 text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
