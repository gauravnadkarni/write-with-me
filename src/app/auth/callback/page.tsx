import { Suspense } from 'react'
import Container from './Container'

export default function CallbackPage() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Container />
    </Suspense>
  )
}
