'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LoginForm } from '@/components/login-form'
import useAuthStore from '@/lib/store/authStore'
import { ThirdPartyAuthProviders } from '@/lib/types/third-party-auth-providers'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const Container = () => {
  const [isScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const {
    signIn: { callback, isSignedIn },
    signinSuccess,
    signinFailure,
    signin,
  } = useAuthStore((state) => state)
  const providerOnClick = (
    e: React.MouseEvent,
    provider: ThirdPartyAuthProviders
  ) => {
    e.preventDefault()
    signin(provider)
  }

  useEffect(() => {
    if (callback) {
      window.open(
        callback,
        'PopupWindow',
        'width=500,height=600,menubar=no,toolbar=no,location=no,status=no'
      )
    }

    const handleMessage = (
      event: MessageEvent<{ error?: string; type: string }>
    ) => {
      if (event.origin !== window.location.origin) return
      if (!event.data.type || event.data.type !== 'provider_oauth') {
        return
      }

      if (!event.data.error) {
        signinSuccess()
        window.location.reload()
      } else {
        signinFailure(event.data.error)
      }
    }

    window.addEventListener('message', handleMessage)

    // Clean up the event listener
    return () => window.removeEventListener('message', handleMessage)
  }, [callback, signinSuccess, signinFailure])

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header
          onClickOfSignOut={() => {}}
          isSignedIn={isSignedIn}
          onClickOfUpgrade={() => {
            router.push('/upgrade')
          }}
          showLinks={false}
          showSignedInButton={false}
          showGetStartedButton={false}
          isPageScrolled={isScrolled}
          isMobileViewOpen={isMobileMenuOpen}
          setIsMobileViewOpen={setIsMobileMenuOpen}
          navLinks={[]}
          showBorder
          userInitials={''}
        />
        <main className="flex flex-col items-center justify-center gap-6 bg-muted p-6  md:p-36 flex-grow">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <LoginForm onClickOfProviderButtons={providerOnClick} />
          </div>
        </main>
        <Footer showLinks={false} />
      </div>
    </>
  )
}
