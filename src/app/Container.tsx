'use client'

import { CTA } from '@/components/CTA'
import { FAQ } from '@/components/FAQ'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { Button } from '@/components/ui/button'
import { animate } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ContainerProps {
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

const NavLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

export const Container: React.FC<ContainerProps> = ({ pricing }) => {
  const [isYearly, setIsYearly] = useState(false)
  const [priceIdToUpgrade, setPriceIdToUpgrade] = useState<string | undefined>(
    undefined
  )
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pricingWithControlComponent = pricing.map((price) => ({
    ...price,
    controlCallback: () => (
      <Link href={`/auth?planId=${price.id}`}>
        <Button className="w-full mt-8 text-card font-semibold">
          Get started
        </Button>
      </Link>
    ),
    active: false,
  }))
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (!section) {
      return
    }
    const targetPosition = section.getBoundingClientRect().top + window.scrollY
    const startPosition = window.scrollY

    animate(startPosition, targetPosition, {
      duration: 0.5, // Adjust duration
      ease: 'easeInOut',
      onUpdate: (value) => window.scrollTo(0, value),
    })
  }

  return (
    <>
      <Header
        onClickOfLink={scrollToSection}
        isSignedIn={false}
        onClickOfUpgrade={() => {}}
        showLinks
        onClickOfSignOut={() => {}}
        isPageScrolled={isScrolled}
        isMobileViewOpen={isMobileMenuOpen}
        setIsMobileViewOpen={setIsMobileMenuOpen}
        navLinks={NavLinks}
        showSignedInButton
        showGetStartedButton
        showBorder={false}
      />
      <main className="pt-16">
        <Hero />
        <Features />
        <Pricing
          pricing={pricingWithControlComponent}
          isYearly={isYearly}
          setYearly={setIsYearly}
          priceIdToUpgrade={priceIdToUpgrade}
          setPriceIdToUpgrade={setPriceIdToUpgrade}
          showPopular
          showActive={false}
          isLoadingCurrentSubscription={false}
        />
        <FAQ />
        <CTA />
      </main>
      <Footer showLinks />
    </>
  )
}
