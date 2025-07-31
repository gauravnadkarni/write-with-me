import { Suspense } from 'react'
import { Container } from './container'

const Dashboard = async () => {
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Container />
      </Suspense>
    </>
  )
}

export default Dashboard
