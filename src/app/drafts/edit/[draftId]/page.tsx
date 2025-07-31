import { createClient } from '@/lib/supabaseServer'
import { Container } from './Container'

const Home = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return <Container user={user!} />
}

export default Home
