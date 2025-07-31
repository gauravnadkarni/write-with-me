'use client'

import { Pricing } from '@/components/Pricing'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { AdditionalInfoPanel } from '@/components/upgrade/AdditionalInfoPanel'
import { Subscription } from '@/components/upgrade/Subscription'
import { SettingsLayout } from '@/components/upgrade/SettingsLayout'
import { toast } from '@/hooks/use-toast'
import useAuthStore from '@/lib/store/authStore'
import useSubscriptionsStore from '@/lib/store/subscriptionsStore'
import { User } from '@supabase/supabase-js'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { convertDateTimeStringToDifferentFormat } from '@/lib/utils'
import { LayoutDashboard } from 'lucide-react'

interface ContainerProps {
  user: User
  pricing: Array<{
    id: string
    name: string
    description: string
    price: number
    billingCycle: string
    popular: boolean
    planType: string
    features: string[]
  }>
}

export const Container: React.FC<ContainerProps> = ({ user, pricing }) => {
  const [isYearly, setIsYearly] = useState(true)
  const [priceIdToUpgrade, setPriceIdToUpgrade] = useState<string | undefined>(
    undefined
  )
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const {
    signout,
    signOut: { isSignedOut },
  } = useAuthStore((state) => state)

  const {
    getSubscription,
    isGetProcessing: isGetSubscriptionProcessing,
    currentSubscription,
    cancelSubscription,
    upgradeSubscription,
    checkoutUrl,
    upgradeSuccess,
    isCancelProcessing,
    cancelSuccess,
  } = useSubscriptionsStore((state) => state)
  const pricingWithControlComponent = pricing.map((price) => ({
    ...price,
    active:
      price.id === currentSubscription?.id &&
      currentSubscription?.isCanceled !== true,
    controlCallback: (
      isLoading: boolean,
      isCancelControl: boolean,
      onClickCallback?: () => void
    ) => {
      console.log(isCancelControl, price)
      return (
        <Button
          className="w-full mt-8 text-card font-semibold"
          disabled={isLoading || isCancelControl}
          onClick={() => {
            if (onClickCallback) {
              onClickCallback()
            }
            if (isCancelControl) {
              if (!currentSubscription || !currentSubscription.subscriptionId) {
                return
              }
              cancelSubscription(currentSubscription.subscriptionId)
              return
            }
            upgradeSubscription(price.id)
          }}
        >
          {isLoading ? (
            <Spinner />
          ) : isCancelControl ? (
            'Active'
          ) : (
            'Change Subscription'
          )}
        </Button>
      )
    },
  }))

  const onClickOfSignout = () => {
    signout()
  }

  useEffect(() => {
    if (isSignedOut) {
      redirect('/auth')
    }
  }, [isSignedOut])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  useEffect(() => {
    if (upgradeSuccess && checkoutUrl) {
      redirect(checkoutUrl)
    }
  }, [checkoutUrl, upgradeSuccess])

  useEffect(() => {
    if (cancelSuccess && !isCancelProcessing) {
      //raise toast to indicate success of cancellation
      toast({
        title: 'Success',
        description: 'Your subscription has been canceled.',
        variant: 'default',
      })
      getSubscription()
      setPriceIdToUpgrade(undefined)
    }
  }, [cancelSuccess, isCancelProcessing, getSubscription, setPriceIdToUpgrade])

  return (
    <>
      <SettingsLayout
        user={user}
        onClickOfSignOut={onClickOfSignout}
        showFooterLinks={false}
        onClickOfUpgrade={() => {
          router.push('/upgrade')
        }}
        isPageScrolled={isScrolled}
        isMobileViewOpen={isMobileViewOpen}
        setIsMobileViewOpen={setIsMobileViewOpen}
        showLinks={false}
        navLinks={[]}
        showSignedInButton={false}
        showGetStartedButton={false}
        showBorder={true}
      >
        <div className="flex justify-center items-center flex-col">
          <div className="w-full">
            <Button variant="link" onClick={() => router.push('/dashboard')}>
              <LayoutDashboard />
              Back To Dashboard
            </Button>
          </div>
          <Subscription
            subscription={
              currentSubscription && {
                ...currentSubscription,
                periodEndDate:
                  currentSubscription?.periodEndDate &&
                  convertDateTimeStringToDifferentFormat(
                    currentSubscription?.periodEndDate,
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "yyyy-MM-dd'T'HH:mm:ss.SSSX",
                    'MMM d, yyyy - h:mm a'
                  ),
              }
            }
            isLoading={isGetSubscriptionProcessing}
          />
          <Pricing
            pricing={pricingWithControlComponent}
            isYearly={isYearly}
            setYearly={setIsYearly}
            priceIdToUpgrade={priceIdToUpgrade}
            setPriceIdToUpgrade={setPriceIdToUpgrade}
            showPopular={false}
            showActive
            isLoadingCurrentSubscription={isGetSubscriptionProcessing}
          />
          <AdditionalInfoPanel />
        </div>
      </SettingsLayout>
    </>
  )
}
