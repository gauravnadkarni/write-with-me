import { Clock, CreditCard, Zap } from 'lucide-react'
import Spinner from '../Spinner'
import { Badge } from '../ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'

interface SubscriptionProps {
  subscription: {
    id: string
    name: string
    isYearly: boolean
    isCanceled: boolean | undefined
    periodEndDate: string | undefined
    totalCreditRemaining: number
    totalCredit: number
  } | null
  cancelSubscription?: () => void
  isLoading: boolean
}

export const Subscription: React.FC<
  SubscriptionProps & React.PropsWithChildren
> = ({ subscription, isLoading, cancelSubscription }) => {
  return (
    <div className="container mx-auto px-4 py-8 text-secondary">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Your Current Subscription</CardTitle>
          <CardDescription>
            View your current plan details and manage your subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Current Plan
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Spinner />
              ) : subscription ? (
                <>
                  <span className="font-medium text-lg">
                    {subscription?.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 border-primary/20 text-primary text-xs"
                  >
                    {subscription?.isYearly ? 'Yearly' : 'Monthly'}
                    {subscription?.isCanceled && ' (Canceled) '}
                  </Badge>
                </>
              ) : null}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Credits Remaining
            </div>
            <div className="font-medium text-lg flex items-center gap-2">
              {isLoading ? (
                <Spinner />
              ) : subscription ? (
                <>
                  {subscription?.totalCreditRemaining}
                  {subscription?.name === 'Free' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 text-xs h-7 px-2"
                      onClick={() => cancelSubscription && cancelSubscription()}
                    >
                      Cancel
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Next Renewal
            </div>
            <div className="font-medium text-lg">
              {isLoading ? (
                <Spinner />
              ) : subscription ? (
                subscription?.periodEndDate ? (
                  subscription.periodEndDate
                ) : (
                  'NA'
                )
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
