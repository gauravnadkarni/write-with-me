import { Usage } from '@prisma/client'

export type UsageModel = Usage

export type UsageModelWithoutUserId = Omit<Usage, 'userId'>

export type UsageModelWithoutTimestamps = Omit<Usage, 'createdAt' | 'updatedAt'>

export type UsageModelWithoutUserIdAndTimestamps = Omit<
  Usage,
  'userId' | 'createdAt' | 'updatedAt'
>
