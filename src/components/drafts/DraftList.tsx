import { FileText } from 'lucide-react'
import { withPagination } from '../hoc/withPagination'
import { Draft, DraftProps } from './Draft'

interface draftListProps {
  drafts: Array<DraftProps>
  isEmpty: boolean
}

export const DraftList: React.FC<draftListProps> = ({ drafts, isEmpty }) => {
  return (
    <section className="space-y-4">
      {drafts &&
        drafts.length > 0 &&
        drafts.map((draft) => <Draft key={draft.id} {...draft} />)}
      {isEmpty && (
        <div className="text-center py-10">
          <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No drafts yet
          </h3>
        </div>
      )}
    </section>
  )
}

export const DraftListWithPagination = withPagination(DraftList)
