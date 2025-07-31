'use client'

import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <Button
        size="icon"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('strike') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('code') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        size="icon"
        variant={
          editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={
          editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={
          editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive('heading', { level: 4 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive('heading', { level: 5 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <Heading5 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('paragraph') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        variant={
          editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'
        }
        size="icon"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        variant={
          editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'
        }
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        variant={
          editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'
        }
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        size="icon"
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}
