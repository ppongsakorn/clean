import { verifyAccessToken, verifyRefreshToken, signAccessToken, hashToken } from '~/server/utils/jwt'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')

  // Try access token first
  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, name: true, email: true, role: true, color: true, isActive: true },
      })
      if (user?.isActive) return { user }
    } catch {}
  }

  // Try refresh token
  const refreshToken = getCookie(event, 'refresh_token')
  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const payload = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })

    if (!user?.isActive || user.refreshTokenHash !== hashToken(refreshToken)) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    // Issue new access token
    const newAccessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role })
    setCookie(event, 'access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    })

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color },
    }
  } catch {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
