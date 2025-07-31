import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ThirdPartyAuthProviders } from '@/lib/types/third-party-auth-providers'
import { cn } from '@/lib/utils'
import { FaGithub, FaGoogle } from 'react-icons/fa'

interface LoginFormProps extends React.ComponentPropsWithoutRef<'div'> {
  onClickOfProviderButtons: (
    e: React.MouseEvent,
    provider: ThirdPartyAuthProviders
  ) => void
}

export function LoginForm({
  className,
  onClickOfProviderButtons,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google or Github account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  onClickOfProviderButtons(e, ThirdPartyAuthProviders.GOOGLE)
                }}
              >
                <FaGoogle />
                Login with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  onClickOfProviderButtons(e, ThirdPartyAuthProviders.GITHUB)
                }}
              >
                <FaGithub />
                Login with Github
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
