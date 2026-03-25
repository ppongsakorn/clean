import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { signAccessToken, signRefreshToken, hashToken } from '~/server/utils/jwt'

const MAX_FAILED = 5
const LOCKOUT_MINUTES = 15

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  if (!user.isActive) {
    throw createError({ statusCode: 403, message: 'Account is deactivated' })
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
    throw createError({ statusCode: 429, message: `Account locked. Try again in ${minutes} minutes` })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    const failedCount = user.failedLoginCount + 1
    const lockedUntil = failedCount >= MAX_FAILED
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
      : null

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: failedCount, lockedUntil },
    })

    if (failedCount >= MAX_FAILED) {
      throw createError({ statusCode: 429, message: `Account locked. Try again in ${LOCKOUT_MINUTES} minutes` })
    }

    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  // Reset failed count on success
  const payload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      refreshTokenHash: hashToken(refreshToken),
    },
  })

  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      color: user.color,
    },
  }
})
