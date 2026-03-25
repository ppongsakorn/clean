import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)
  const taskId = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  })
  if (!task) throw createError({ statusCode: 404, message: 'Task not found' })

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId: payload.userId } },
  })
  if (!member) throw createError({ statusCode: 403, message: 'Forbidden' })

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.statusId !== undefined && { statusId: body.statusId }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      ...(body.progress !== undefined && { progress: body.progress }),
      ...(body.humanPercent !== undefined && { humanPercent: body.humanPercent }),
    },
    include: {
      status: { select: { id: true, name: true, color: true, category: true, position: true } },
      assignees: { include: { user: { select: { id: true, name: true, color: true } } } },
    },
  })

  return updated
})
