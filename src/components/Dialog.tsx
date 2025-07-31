import { FolderPlus } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface DialobBoxProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  content: React.ReactNode
  footer: React.ReactNode
}

export const DialogBox: React.FC<DialobBoxProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  content,
  footer,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <FolderPlus className="h-4 w-4" />
          <span className="sr-only">Add Folder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">{content}</div>
        <DialogFooter className="mt-4">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
