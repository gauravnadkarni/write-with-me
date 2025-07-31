import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from './providers/ThemeProvider'

export const Hero = () => {
  const { theme } = useTheme()
  const imageSrc =
    theme === 'dark'
      ? '/images/dark-dashboard.png'
      : '/images/light-dashboard.png'

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Writing made simple, powerful, and beautiful.
            </span>
          </div>

          <h1 className="heading-xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80 py-4">
            Elevate Your Writing Experience
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-3xl mx-auto">
            WriteWithMe combines the power of AI with elegant design to
            transform how you create, edit, and share your writing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="h-14 px-8 text-base" asChild>
              <Link href="/auth">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base">
              <Link href="#learn-more">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-border p-2">
            <div className="w-full h-full rounded-xl bg-card shadow-lg overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={imageSrc}
                  alt="Hero Image"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/*<div className="w-full h-10 bg-secondary flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                <div className="flex-1"></div>
              </div>
              <div className="flex h-[calc(100%-2.5rem)]">
                <div className="w-64 border-r border-border bg-secondary/50">
                  <div className="p-4">
                    <div className="h-10 bg-background/70 rounded w-full mb-4"></div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 bg-background/40 rounded w-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="h-10 bg-background/20 rounded w-3/4 mb-6"></div>
                  <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-background/20 rounded w-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>*/}
            </div>
          </div>

          <div className="absolute -z-10 inset-0 blur-3xl bg-primary/20 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute -z-10 inset-0 blur-3xl bg-accent/20 rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
        </div>
      </div>
    </section>
  )
}
