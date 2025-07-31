import { Check } from 'lucide-react'

interface PricingProps {
  pricing: Array<{
    id: string
    name: string
    description: string
    price: number
    billingCycle: string
    popular: boolean
    planType: string
    features: string[]
    yearlyDiscount?: string
    controlCallback: (
      isLoading: boolean,
      isCancelControl: boolean,
      onClickCallback?: () => void
    ) => React.ReactElement
    active: boolean
  }>
  isYearly: boolean
  setYearly: (isYearly: boolean) => void
  priceIdToUpgrade: string | undefined
  setPriceIdToUpgrade: (priceIdToBeUpgrade: string | undefined) => void
  showPopular: boolean
  showActive?: boolean
  isLoadingCurrentSubscription: boolean
}

export const Pricing: React.FC<PricingProps> = ({
  pricing,
  isYearly,
  setYearly,
  priceIdToUpgrade,
  setPriceIdToUpgrade,
  showPopular,
  showActive,
  isLoadingCurrentSubscription,
}) => {
  return (
    <section id="pricing" className="section">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Pricing</span>
          </div>
          <h2 className="heading-lg mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-foreground/70 mb-10">
            Choose the plan that works best for you and your team.
          </p>

          <div className="flex items-center justify-center mb-8">
            <div className="bg-secondary rounded-full p-1 flex">
              <button
                onClick={() => setYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isYearly
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isYearly
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricing
            .filter(
              (price) =>
                price.billingCycle === (isYearly ? 'YEARLY' : 'MONTHLY')
            )
            .map((plan, index) => (
              <div
                key={index}
                className={`glass-card rounded-xl p-8 transition-all duration-300 hover:shadow-md ${
                  plan.popular && showPopular
                    ? 'ring-2 ring-primary shadow-lg relative'
                    : 'border border-border'
                }`}
              >
                {plan.popular && showPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {plan.active && showActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-foreground/70 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-foreground/70 ml-1">
                    /{isYearly ? 'year' : 'month'}
                  </span>

                  {plan.yearlyDiscount && isYearly && (
                    <div className="mt-2">
                      <span className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                        {plan.yearlyDiscount}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.controlCallback(
                  isLoadingCurrentSubscription || plan.id === priceIdToUpgrade,
                  plan.active,
                  () => {
                    setPriceIdToUpgrade(plan.id)
                  }
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
