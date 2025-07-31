import { listAllPricings } from '@/lib/services/pricing-handler'
import { Container } from './Container'

const getPricings = async () => {
  return await listAllPricings(1, 10)
}

const Home = async () => {
  const pricing = await getPricings()
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
    active: false,
  }))
  return <Container pricing={pricingData.sort((a, b) => a.order - b.order)} />
}

export default Home
