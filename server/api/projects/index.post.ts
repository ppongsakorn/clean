import { verifyAccessToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyAccessToken(token)
  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Project name is required' })
  }

  const defaultStatuses = [
    { name: 'Backlog',     color: '#64748B', category: 'NOT_STARTED', position: 0 },
    { name: 'To Do',       color: '#3B82F6', category: 'NOT_STARTED', position: 1 },
    { name: 'In Progress', color: '#2365AA', category: 'ACTIVE',      position: 2 },
    { name: 'In Review',   color: '#F59E0B', category: 'ACTIVE',      position: 3 },
    { name: 'Done',        color: '#22C55E', category: 'DONE',        position: 4 },
    { name: 'Cancelled',   color: '#4A4A4A', category: 'DONE',        position: 5 },
  ]

  const project = await prisma.project.create({
    data: {
      name: body.name.trim(),
      color: body.color || null,
      visibility: body.visibility || 'TEAM',
      createdById: payload.userId,
      members: {
        create: { userId: payload.userId, role: 'MANAGER' },
      },
      taskStatuses: {
        create: defaultStatuses,
      },
    },
    select: { id: true, name: true, color: true },
  })

  return project
})
