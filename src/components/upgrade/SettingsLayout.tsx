import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { User } from '@supabase/supabase-js'

interface SettingsLayoutProps {
  user: User
  onClickOfSignOut: (e: React.MouseEvent) => void
  onClickOfUpgrade: (e: React.MouseEvent) => void
  showFooterLinks: boolean
  isPageScrolled: boolean
  isMobileViewOpen: boolean
  setIsMobileViewOpen: (value: boolean) => void
  showLinks: boolean
  navLinks: Array<{ name: string; href: string }>
  showSignedInButton: boolean
  showGetStartedButton: boolean
  showBorder: boolean
}

export const SettingsLayout: React.FC<
  SettingsLayoutProps & React.PropsWithChildren
> = ({
  user,
  onClickOfSignOut,
  showFooterLinks,
  onClickOfUpgrade,
  isPageScrolled,
  isMobileViewOpen,
  setIsMobileViewOpen,
  showLinks,
  navLinks,
  showSignedInButton,
  showGetStartedButton,
  showBorder,
  children,
}) => {
  return (
    <>
      <Header
        isSignedIn={user ? true : false}
        onClickOfSignOut={onClickOfSignOut}
        onClickOfLink={() => {}}
        onClickOfUpgrade={onClickOfUpgrade}
        showLinks={showLinks}
        isPageScrolled={isPageScrolled}
        isMobileViewOpen={isMobileViewOpen}
        setIsMobileViewOpen={setIsMobileViewOpen}
        navLinks={navLinks}
        showSignedInButton={showSignedInButton}
        showGetStartedButton={showGetStartedButton}
        showBorder={showBorder}
      />
      <div className="min-h-[calc(100vh-7rem)] bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-20">{children}</div>
      </div>
      <Footer showLinks={showFooterLinks} />
    </>
  )
}
