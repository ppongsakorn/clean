import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)
  const body = await readBody(event)

  if (!body.title?.trim()) throw createError({ statusCode: 400, message: 'Title is required' })
  if (!body.projectId) throw createError({ statusCode: 400, message: 'projectId is required' })
  if (!body.statusId) throw createError({ statusCode: 400, message: 'statusId is required' })

  // verify membership
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: body.projectId, userId: payload.userId } },
  })
  if (!member) throw createError({ statusCode: 403, message: 'Forbidden' })

  // get max position in that status group
  const last = await prisma.task.findFirst({
    where: { projectId: body.projectId, statusId: body.statusId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })

  const task = await prisma.task.create({
    data: {
      title: body.title.trim(),
      projectId: body.projectId,
      statusId: body.statusId,
      reporterId: payload.userId,
      position: (last?.position ?? -1) + 1,
    },
    include: {
      status: { select: { id: true, name: true, color: true, category: true, position: true } },
      assignees: { include: { user: { select: { id: true, name: true, color: true } } } },
    },
  })

  return task
})
