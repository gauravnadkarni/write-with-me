import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { Menu, X, LogOut, ShieldPlus, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  isSignedIn: boolean
  userInitials?: string
  onClickOfSignOut: (e: React.MouseEvent) => void
  onClickOfUpgrade: (e: React.MouseEvent) => void
  onClickOfLink?: (id: string) => void
  isPageScrolled: boolean
  isMobileViewOpen: boolean
  setIsMobileViewOpen: (value: boolean) => void
  showLinks: boolean
  navLinks: Array<{ name: string; href: string }>
  showSignedInButton: boolean
  showGetStartedButton: boolean
  showBorder: boolean
}

export const Header: React.FC<HeaderProps> = ({
  isSignedIn,
  onClickOfSignOut,
  onClickOfUpgrade,
  onClickOfLink,
  showLinks,
  isPageScrolled,
  isMobileViewOpen,
  setIsMobileViewOpen,
  navLinks,
  showSignedInButton,
  showGetStartedButton,
  showBorder,
  userInitials,
}) => {
  const toggleMobileMenu = () => {
    setIsMobileViewOpen(!isMobileViewOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isPageScrolled || showBorder
          ? 'py-3 bg-background/80 backdrop-blur-lg shadow-sm border-b border-border/40'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              WriteWithMe
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {showLinks &&
            !isSignedIn &&
            navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={
                  onClickOfLink
                    ? () => {
                        onClickOfLink(link.href.slice(1))
                      }
                    : undefined
                }
                className="text-foreground/80 hover:text-foreground font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {!isSignedIn && (
            <>
              {showSignedInButton && (
                <Link href="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
              {showGetStartedButton && (
                <Link href="/auth">
                  <Button>Get Started</Button>
                </Link>
              )}
            </>
          )}
          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="inline-block h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center">
                    {userInitials || 'U'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-accent">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onClickOfUpgrade}
                >
                  <ShieldPlus className="mr-2 h-4 w-4" /> Upgrade
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onClickOfSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileViewOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileViewOpen && (
        <div className="md:hidden px-4 py-6 bg-background/95 backdrop-blur-lg border-b border-border animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {showLinks &&
              !isSignedIn &&
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground font-medium transition-colors py-2"
                  onClick={() => setIsMobileViewOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            <div className="flex flex-col space-y-3 pt-4">
              {!isSignedIn && (
                <>
                  {showSignedInButton && (
                    <Link href="/auth">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                  {showGetStartedButton && (
                    <Link href="/auth">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  )}
                </>
              )}
              {isSignedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-accent">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={onClickOfUpgrade}
                    >
                      <ShieldPlus className="mr-2 h-4 w-4" /> Upgrade
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onClickOfSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
