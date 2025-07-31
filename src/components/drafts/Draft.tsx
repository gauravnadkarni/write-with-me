import { replaceLongTextWithEllipses } from '@/lib/utils'
import { Download, Edit, FileText, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { DragLayerMonitor, useDrag } from 'react-dnd'
import { ItemTypes, DraftDragItem } from '@/lib/types/dnd-types'
import { useCallback, useMemo } from 'react'

export interface DraftProps {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  folderId: string | null
  onClickOfEdit: (draftId: string, e: React.MouseEvent) => void
  onClickOfDelete: (draftId: string, e: React.MouseEvent) => void
  onClickOfDownload: (draftId: string, e: React.MouseEvent) => void
  isProcessing: boolean
}

export const Draft: React.FC<DraftProps> = ({
  id,
  title,
  createdAt,
  content,
  folderId,
  onClickOfEdit,
  onClickOfDelete,
  onClickOfDownload,
}) => {
  // Memoize the drag configuration to prevent infinite loops
  const dragSpec = useMemo(
    () => ({
      type: ItemTypes.DRAFT,
      item: { type: ItemTypes.DRAFT, draftId: id, folderId } as DraftDragItem,
      collect: (monitor: DragLayerMonitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      options: {
        dropEffect: 'move',
      },
    }),
    [id, folderId]
  )

  const [{ isDragging }, drag] = useDrag(dragSpec)

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node)
      }
    },
    [drag]
  )

  return (
    <Card
      ref={dragRef}
      key={id}
      className={`border border-border/40 hover:border-primary/30 transition-colors group hover:shadow-sm ${isDragging ? 'opacity-50' : ''} cursor-grab active:cursor-grabbing`}
      role="draggable"
      aria-label={`Draft: ${title}`}
      data-testid={`draft-${id}`}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
          {
            <p className="text-muted-foreground text-sm mt-2">
              {replaceLongTextWithEllipses(content, 50)}
            </p>
          }

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-primary/70 mr-1.5" />
              <span className="text-xs text-muted-foreground">Draft</span>
            </div>
            <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded"
                title="Edit this draft"
                aria-label="Edit this draft"
                onClick={(e) => {
                  onClickOfEdit(id, e)
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive rounded"
                title="Delete this draft"
                aria-label="Delete this draft"
                onClick={(e) => {
                  onClickOfDelete(id, e)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded"
                title="Download file in Markdown format"
                area-label="Download file in Markdown format"
                onClick={(e) => {
                  onClickOfDownload(id, e)
                }}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
