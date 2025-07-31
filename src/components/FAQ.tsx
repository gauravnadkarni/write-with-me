import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Does free plan have any limits?',
    answer:
      'Yes, the free plan has a limit of upto 10 AI suggestions per day. You can save upto five drafts. If you need more, you can upgrade to a paid plan.',
  },
  {
    question: 'Can I switch between plans?',
    answer:
      "Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, your new rate will take effect at the start of your next billing cycle.",
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Yes, we take data security and privacy seriously. All your data is encrypted in transit and at rest. We never share or sell your information to third parties. You can export or delete your data at any time.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="section bg-secondary/50">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h2 className="heading-lg mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/70">
            Have a question? Find quick answers to common questions about
            WriteWithMe.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
