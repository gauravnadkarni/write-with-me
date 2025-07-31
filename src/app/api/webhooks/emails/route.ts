import { sendNewUserWelcomeEmail } from '@/lib/services/email-handler'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('Processing emails started')
  const numberOfEmailsSent = await sendNewUserWelcomeEmail()
  console.log(`Processing emails completed. Emails sent: ${numberOfEmailsSent}`)
  return NextResponse.json({ message: 'Email queue processed' })
}
