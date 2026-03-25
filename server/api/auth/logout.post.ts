import { prisma } from '~/server/utils/prisma'
import { verifyAccessToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')

  if (token) {
    try {
      const payload = verifyAccessToken(token)
      await prisma.user.update({
        where: { id: payload.userId },
        data: { refreshTokenHash: null },
      })
    } catch {}
  }

  deleteCookie(event, 'access_token', { path: '/' })
  deleteCookie(event, 'refresh_token', { path: '/' })

  return { success: true }
})
