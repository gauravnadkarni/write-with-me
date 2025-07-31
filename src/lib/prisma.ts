import { PrismaClient } from '@prisma/client'
import { AuthError } from './errors/auth-error'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

prisma.$use(async (params, next) => {
  console.log('Query:', params)
  return next(params)
})

prisma.$use(async (params, next) => {
  //for updating timestamp for updatedAt in folders when draft under that folder is created/updated/deleted
  if (
    params.model === 'Drafts' &&
    ['create', 'update', 'delete', 'upsert'].includes(params.action)
  ) {
    const result = await next(params)
    let folderId
    switch (params.action) {
      case 'create':
      case 'update':
        folderId = params.args.data.folder.connect.id
        break
      case 'delete':
        folderId = params.args.where.folderId
        break
    }

    if (folderId) {
      await prisma.folders.update({
        where: { id: folderId },
        data: { updatedAt: new Date() },
      })
    }
    return result
  }
  return next(params)
})

export const applyWithUserFilter = (filters: Record<string, unknown>) => {
  if (!filters.userId) {
    throw new AuthError('User not found', 401)
  }
  return {
    where: {
      ...filters,
    },
  }
}
export default prisma
