import { createClient } from '@/lib/supabaseServer'
import { Container } from './Container'

const Dashboard = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <>
      <Container user={user!} />
    </>
  )
}

export default Dashboard
