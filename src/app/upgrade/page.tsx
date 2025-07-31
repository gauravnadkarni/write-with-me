import { listAllPricings } from '@/lib/services/pricing-handler'
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { Container } from './Container'

const getPricings = async () => {
  return await listAllPricings(1, 10)
}

const Upgrade = async ({
  searchParams,
}: {
  searchParams: { planId?: string }
}) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const pricing = await getPricings()
  //const currentSubscription = await getCurrentSubscription(user!.id);
  if (searchParams.planId) {
    const freePlan = pricing.find(
      (price) => price.id === searchParams.planId && price.planType === 'FREE'
    )
    if (freePlan) {
      return redirect('/dashboard')
    }
  }
  const pricingData = pricing.map((price) => ({
    id: price.id,
    name: price.name,
    description: price.description,
    price: price.price.toNumber(),
    billingCycle: price.billingCycle,
    popular: price.popular,
    planType: price.planType,
    features: price.features,
    order: price.order,
    //active: price.id === currentSubscription?.priceId,
  }))

  return (
    <>
      <Container
        user={user!}
        pricing={pricingData.sort((a, b) => a.order - b.order)}
      />
    </>
  )
}

export default Upgrade
