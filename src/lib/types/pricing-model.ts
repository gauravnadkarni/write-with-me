import { Prices } from '@prisma/client'

export type PricingModel = Prices

export type PricingModelWithoutUserId = Omit<Prices, 'userId'>

export type PricingModelWithoutTimestamps = Omit<
  Prices,
  'createdAt' | 'updatedAt'
>

export type PricingModelWithoutUserIdAndTimestamps = Omit<
  Prices,
  'userId' | 'createdAt' | 'updatedAt'
>

export enum PriceTypeEnum {
  PRO = 'PRO',
  TEAM = 'TEAM',
  FREE = 'FREE',
}
