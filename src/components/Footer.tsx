import { ThemeToggle } from '@/components/ThemeToggle'

export const Footer: React.FC<{
  showLinks: boolean
}> = ({ showLinks }) => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#docs' },
        { name: 'Help Center', href: '#help' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '#privacy' },
        { name: 'Terms', href: '#terms' },
        { name: 'Security', href: '#security' },
      ],
    },
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-wide py-12 md:py-16">
        {showLinks && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  WriteWithMe
                </span>
                <div className="ml-3">
                  <ThemeToggle />
                </div>
              </div>
              <p className="text-foreground/70 mb-6 max-w-md">
                Elevate your writing experience with powerful tools, elegant
                design, and intelligent features.
              </p>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="font-semibold mb-4">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="text-foreground/70 hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">
            © {currentYear} WriteWithMe. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="#twitter"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              X
            </a>
            <a
              href="#linkedin"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#github"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
