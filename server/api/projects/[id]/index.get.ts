import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)
  const projectId = getRouterParam(event, 'id')!

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: payload.userId } },
    include: {
      project: {
        select: { id: true, name: true, color: true, showAiRatio: true },
      },
    },
  })

  if (!member) throw createError({ statusCode: 403, message: 'Forbidden' })

  return member.project
})
