import prisma from '@/lib/prisma'
import { UserModel } from '../types/user-model'

export const createUser = async (
  userId: string,
  email: string,
  name: string
): Promise<UserModel> => {
  return prisma.users.create({
    data: {
      id: userId,
      email,
      name,
    },
  })
}

export const getByEmail = async (email: string): Promise<UserModel | null> => {
  return prisma.users.findUnique({
    where: { email },
  })
}

export const getById = async (id: string): Promise<UserModel | null> => {
  return prisma.users.findUnique({
    where: { id },
  })
}

export const getByStripeCustomerId = async (
  stripeCustomerId: string
): Promise<UserModel | null> => {
  return prisma.users.findFirst({
    where: { stripeCustomerId },
  })
}

export const updateStripeId = async (
  userId: string,
  stripeUserId: string
): Promise<UserModel> =>
  prisma.users.update({
    data: {
      stripeCustomerId: stripeUserId,
    },
    where: { id: userId },
  })
