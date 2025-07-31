'use server'

import { serverActionWrapper } from '@/lib/server-action-wrapper'
import {
  clearSession,
  initiateAuthWithThirdPartyProvider,
  setSessionCookies,
  validateAuthCodeWithProvider,
} from '@/lib/services/auth-handler'
import { getUserById, setupNewUser } from '@/lib/services/user-handler'
import { ThirdPartyAuthProviders } from '@/lib/types/third-party-auth-providers'
import { getNewUserEmailAsString } from '../services/email-handler'
import { storeDataInProcessBucket } from '../services/storage-handler'
import { v4 as uuidv4 } from 'uuid'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const signout = async () => {
  const serverAction = async () => {
    await clearSession()
  }
  return serverActionWrapper(serverAction)
}

export const authWithProvider = async (provider: ThirdPartyAuthProviders) => {
  const serverAction = async () => {
    const data = await initiateAuthWithThirdPartyProvider(
      provider,
      `${baseUrl}/auth/callback`
    )
    return data
  }
  return serverActionWrapper(serverAction)
}

export const validateAuthWithProvider = async (authCode: string) => {
  const serverAction = async () => {
    const data = await validateAuthCodeWithProvider(authCode)
    const session = data.session

    const user = await getUserById(session.user.id)
    if (!user) {
      await setupNewUser(session.user.id, session.user.email!)
      try {
        const emailContent = await getNewUserEmailAsString(session.user.email!)
        await storeDataInProcessBucket(
          {
            payloadType: 'welcome-email',
            payload: {
              emailContent,
              toEmail: session.user.email!,
              fromEmail: 'Support Team <onboarding@resend.dev>',
              subject: 'Welcome to our platform',
            },
          },
          `${uuidv4()}.json`
        )
      } catch (err) {
        console.log(err)
      }
    }
    setSessionCookies(
      session.access_token,
      session.refresh_token,
      session.expires_in,
      session.expires_in
    )
    return data
  }

  return serverActionWrapper(serverAction)
}
