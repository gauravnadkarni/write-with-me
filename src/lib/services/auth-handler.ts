import { cookies } from 'next/headers'
import { AuthError } from '../errors/auth-error'
import { createClient } from '../supabaseServer'
import { getByEmail } from '../repositories/users'
import { ValidationError } from '../errors/validation-error'
import { AppError } from '../errors/app-error'
import { ThirdPartyAuthProviders } from '../types/third-party-auth-providers'

export const signinWithBackend = async (email: string, password: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new AuthError(error.message)
  }
  return data
}

export const setSessionCookies = (
  accessToken: string,
  refreshToken: string,
  accessTokenExpiresIn: number,
  refreshTokenExpiresIn: number
) => {
  cookies().set('sb-access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: accessTokenExpiresIn,
  })
  cookies().set('sb-refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: refreshTokenExpiresIn,
  })
}

export const registerNewUserByPassword = async (
  email: string,
  password: string,
  name: string
) => {
  const supabase = await createClient()
  const user = await getByEmail(email)
  if (user) {
    throw new ValidationError('User already exists')
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    throw new AppError(error.message, 500)
  }
  return data
}

export const clearSession = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new AuthError(error.message)
  }
  cookies().delete('sb-access-token')
  cookies().delete('sb-refresh-token')
}

export const initiateAuthWithThirdPartyProvider = async (
  provider: ThirdPartyAuthProviders,
  authCallback: string
) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallback,
    },
  })
  if (error) {
    throw new AuthError(error.message)
  }
  return data
}

export const validateAuthCodeWithProvider = async (authCode: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode)
  if (error) {
    throw new AuthError(error.message)
  }
  return data
}

export const getAuthUser = async () => {
  const supabase = await createClient()
  const {
    data: { user: userFromSession },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new AuthError(error.message, 401, error)
  }
  return userFromSession!
}
