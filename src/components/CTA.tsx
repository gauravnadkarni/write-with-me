import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const CTA = () => {
  return (
    <section className="section">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-1">
          <div className="bg-background rounded-[calc(1.5rem-4px)] p-12 md:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-lg mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Ready to Elevate Your Writing?
              </h2>
              <p className="text-lg text-foreground/70 mb-10 max-w-2xl mx-auto">
                Join thousands of writers who are already using WriteWithMe to
                create amazing content and streamline their writing process.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth">
                  <Button size="lg" className="h-14 px-8 text-base">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base"
                  >
                    See Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
