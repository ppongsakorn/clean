import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)
  const projectId = getRouterParam(event, 'id')!

  // verify membership
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: payload.userId } },
  })
  if (!member) throw createError({ statusCode: 403, message: 'Forbidden' })

  const tasks = await prisma.task.findMany({
    where: { projectId, isArchived: false, parentTaskId: null },
    include: {
      status: { select: { id: true, name: true, color: true, category: true, position: true } },
      assignees: { include: { user: { select: { id: true, name: true, color: true } } } },
    },
    orderBy: [{ status: { position: 'asc' } }, { position: 'asc' }],
  })

  return tasks
})
