import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)

  const members = await prisma.projectMember.findMany({
    where: { userId: payload.userId },
    include: { project: { select: { id: true, name: true, color: true, isArchived: true } } },
  })

  return members
    .filter(m => !m.project.isArchived)
    .map(m => m.project)
})
