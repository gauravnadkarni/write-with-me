import { Star } from 'lucide-react'
import { Button } from '../ui/button'

export const AdditionalInfoPanel: React.FC<React.PropsWithChildren> = ({}) => {
  return (
    <div className="bg-muted/30 p-6 rounded-lg border border-border mt-10 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Need Help Choosing?</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Contact our team for personalized guidance on selecting the right plan
        for your needs.
      </p>
      <Button variant="outline" className="text-sm">
        Contact Support
      </Button>
    </div>
  )
}
