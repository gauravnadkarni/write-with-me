import { Resend } from 'resend'
import { listEmailsByStatus, updateEmailStatus } from '../repositories/emails'
import { EmailStatusEnum } from '../types/email-model'
import WelcomeEmail, {
  getComponentAsString,
} from '@/components/email-templates/WelcomeEmail'

const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendNewUserWelcomeEmail = async (): Promise<number> => {
  let isDone = false
  let emailsSent: number = 0
  do {
    try {
      const emails = await listEmailsByStatus(EmailStatusEnum.PENDING)
      isDone = emails.length === 0
      if (emails.length > 0) {
        for (const email of emails) {
          try {
            await resend.emails.send({
              from: 'Support Team <onboarding@resend.dev>',
              to: [email.email],
              subject: 'Welcome to our platform',
              react: WelcomeEmail({ email: email.email }),
            })
            emailsSent++
            await updateEmailStatus(email.id, EmailStatusEnum.SENT)
          } catch (error) {
            console.error('Error sending email:', email.id, error)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  } while (!isDone)
  return emailsSent
}

export const getNewUserEmailAsString = async (email: string) => {
  const html = await getComponentAsString({ email })
  return html
}
