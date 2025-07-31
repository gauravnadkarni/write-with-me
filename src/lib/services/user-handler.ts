import { createFolder } from '../repositories/folders'
import {
  createUser,
  getById,
  getByStripeCustomerId,
  updateStripeId,
} from '../repositories/users'

export const setupNewUser = async (authUserId: string, email: string) => {
  const userModel = await createUser(authUserId, email, email)
  await createFolder('Uncategorized', '#ffffff', 'NA', userModel.id, true)
  //await createNewUsageRecord(userModel.id)
  return userModel
}

export const getUserById = async (userId: string) => getById(userId)

export const getUserByStripeCustomerId = async (stripeCustomerId: string) =>
  getByStripeCustomerId(stripeCustomerId)

export const updateStripeCustomerId = async (
  userId: string,
  stripeUserId: string
) => updateStripeId(userId, stripeUserId)
