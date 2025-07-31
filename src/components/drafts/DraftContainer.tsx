import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import {
  Editor,
  EditorContent,
  Extensions,
  Node,
  mergeAttributes,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { MutableRefObject } from 'react'
import { Markdown } from 'tiptap-markdown'
import Spinner from '../Spinner'
import { MenuBar } from './DraftMenubar'
import { SuggestionModel } from '@/lib/types/suggestion-model'
import { replaceLongTextWithEllipses } from '@/lib/utils'
import { Progress } from '../ui/progress'

interface DraftContainerProps {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  suggestions: Array<SuggestionModel>
  isLoadingSuggestions: boolean
  getNewSuggestions: (context: string) => Promise<void>
  resetSuggestions: () => void
  suggestionTimeoutRef: MutableRefObject<NodeJS.Timeout | undefined>
  onSave: (title: string, content: string) => Promise<void>
  className?: string
  isProcessing: boolean
  apiUsagePercentage: number
  isLoadingApiUsage: boolean
  remainingCredit: number
}

const getSuggestionNodes = (
  suggestions: Array<{ id: string; text: string }>
) => {
  return suggestions.map(({ id, text }: { id: string; text: string }) => {
    return Node.create({
      name: id,
      group: 'inline',
      inline: true,
      parseHTML() {
        return [
          {
            tag: 'span',
            getAttrs: (node) => node.hasAttribute(`data-${id}`) && null,
          },
        ]
      },

      renderHTML({ HTMLAttributes }) {
        return [
          'span',
          mergeAttributes({ [`data-${id}`]: '', HTMLAttributes }),
          id,
        ]
      },

      renderText() {
        return text
      },
    })
  })
}

export const getEditor = (
  content: string,
  extensions: Extensions | undefined
) =>
  new Editor({
    extensions: extensions
      ? extensions
      : [
          StarterKit,
          Highlight,
          Typography,
          Markdown,
          TextAlign.configure({
            types: ['heading', 'paragraph'], // Node types to apply text alignment
            alignments: ['left', 'center', 'right', 'justify'], // Available alignments
          }),
        ],
    content: content,
  })

export default function DraftContainer({
  title,
  setTitle,
  content,
  setContent,
  suggestions,
  isLoadingSuggestions,
  suggestionTimeoutRef,
  getNewSuggestions,
  resetSuggestions,
  onSave,
  isProcessing,
  apiUsagePercentage,
  isLoadingApiUsage,
  remainingCredit,
  className = '',
}: DraftContainerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Markdown,
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Node types to apply text alignment
        alignments: ['left', 'center', 'right', 'justify'], // Available alignments
      }),
      ...getSuggestionNodes(suggestions),
    ],
    content: content,
    onUpdate: async ({ editor }) => {
      if (suggestionTimeoutRef && suggestionTimeoutRef.current)
        clearTimeout(suggestionTimeoutRef.current)
      suggestionTimeoutRef.current = setTimeout(async () => {
        await getNewSuggestions(editor.getHTML())
      }, 2000)
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[500px] p-4 prose dark:prose-invert max-w-none focus:outline-none bg-background',
      },
    },
  })

  const handleSave = async () => {
    if (!editor || !title || !content) return
    await onSave(title, content)
  }

  return (
    <Card
      className={`w-full w-full mx-auto my-8 ${className} bg-card-background`}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div>Drafts</div>
            {isLoadingApiUsage && (
              <div className="mx-4">
                <Spinner />
              </div>
            )}
            {!isLoadingApiUsage && (
              <div className="text-xs text-secondary flex items-center w-36 gap-2">
                <Progress
                  className={clsx(
                    'border',
                    remainingCredit <= 0 && 'bg-red-500'
                  )}
                  title={`${remainingCredit} Credits remaining`}
                  value={apiUsagePercentage}
                />
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />

          <div className="border rounded-md overflow-hidden">
            <MenuBar editor={editor} />
            <div
              className={clsx(
                'border-b',
                'flex',
                'flex-wrap',
                'gap-2',
                'relative',
                (isLoadingSuggestions || suggestions.length === 0) && 'p-4'
              )}
            >
              {isLoadingSuggestions && (
                <div className="absolute inset-0 w-full h-full flex justify-center items-center z-[9999] opacity-40">
                  <Spinner />
                </div>
              )}
              {!isLoadingSuggestions &&
                suggestions.length > 0 &&
                suggestions.map((suggestion) => (
                  <Button
                    key={`${suggestion.id}`}
                    data-testid={`${suggestion.id}`}
                    title={suggestion.text}
                    variant={'link'}
                    onClick={() => {
                      editor!
                        .chain()
                        .insertContent(suggestion.text)
                        .focus()
                        .run()
                      resetSuggestions()
                      if (suggestionTimeoutRef.current)
                        clearTimeout(suggestionTimeoutRef.current) // Reset timer
                    }}
                  >
                    {replaceLongTextWithEllipses(suggestion.text.trim(), 10)}
                  </Button>
                ))}
              {!isLoadingSuggestions && suggestions.length > 0 && (
                <Button
                  key="close button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    resetSuggestions()
                  }}
                >
                  <X />
                </Button>
              )}
            </div>
            <EditorContent editor={editor} content={content} />
          </div>

          <Button
            onClick={handleSave}
            disabled={!title || !editor?.getText() || isProcessing}
            className="w-full relative bg-foreground text-primary"
          >
            {isProcessing && (
              <div className="absolute inset-0 w-full h-full flex justify-center items-center z-[9999] bg-green-50 opacity-40">
                <Spinner />
              </div>
            )}
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
