import { Emails } from '@prisma/client'

export type EmailModel = Emails

export type EmailModelWithoutUserId = Omit<Emails, 'userId'>

export type EmailModelWithoutTimestamps = Omit<
  Emails,
  'createdAt' | 'updatedAt'
>

export type EmailModelWithoutUserIdAndTimestamps = Omit<
  Emails,
  'userId' | 'createdAt' | 'updatedAt'
>

export enum EmailStatusEnum {
  PENDING = 'PENDING',
  SENT = 'SENT',
}
