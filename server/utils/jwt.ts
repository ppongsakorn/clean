import jwt from 'jsonwebtoken'
import { createHash } from 'crypto'

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const ACCESS_TTL = '1h'
const REFRESH_TTL = '7d'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL })
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
