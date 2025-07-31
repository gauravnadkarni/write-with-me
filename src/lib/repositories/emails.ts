import { EmailModel, EmailStatusEnum } from '../types/email-model'
import prisma from '@/lib/prisma'

export const listEmailsByStatus = async (
  status: EmailStatusEnum,
  page: number = 1,
  pageSize: number = 10
): Promise<Array<EmailModel>> =>
  prisma.emails.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      status,
    },
  })

export const updateEmailStatus = async (
  id: string,
  status: EmailStatusEnum
): Promise<EmailModel> =>
  prisma.emails.update({
    data: {
      status,
    },
    where: { id },
  })
