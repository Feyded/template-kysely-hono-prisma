import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../jwt'
import * as envModule from '@/env'
import { jwtVerify } from 'jose'

// Behaviors under test:
// 1) Should generate an access token that verifies with access secret
// 2) Should generate a refresh token that does not verify with access secret
// 3) Should return null when verifying an invalid token
// 4) Should throw NotFoundError if JWT_ACCESS_SECRET is missing when generating access token
// 5) Should throw NotFoundError if JWT_REFRESH_SECRET is missing when generating refresh token
// 6) Should respect expiration: an already-expired token verification returns null

vi.mock('jose', async (orig) => {
  // Partial mock to allow real jwtVerify behavior, but we might spy if needed
  const actual = await (orig as any).importActual<typeof import('jose')>('jose')
  return {
    ...actual,
  }
})

describe('utils/jwt', () => {
  const payload = { id: 'u1', email: 'u1@example.com' }

  let envSpy: jest.SpyInstance | null = null as any

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('generates an access token that verifies with access secret', async () => {
    const token = await generateAccessToken(payload)
    const verified = await verifyToken(token)
    expect(verified).toBeTruthy()
    expect(verified?.sub).toBeUndefined() // we don't set sub, payload is returned
    expect(verified?.id).toBe(payload.id)
    expect(verified?.email).toBe(payload.email)
  })

  it('generates a refresh token that fails verification with access secret', async () => {
    const refreshToken = await generateRefreshToken(payload)
    const result = await verifyToken(refreshToken)
    expect(result).toBeNull()
  })

  it('returns null when verifying an invalid token', async () => {
    const result = await verifyToken('not-a-jwt')
    expect(result).toBeNull()
  })

  it('throws NotFoundError if JWT_ACCESS_SECRET is missing for access token generation', async () => {
    // Mock env module to remove access secret
    const mod = await import('@/env')
    const original = { ...mod.envConfig }
    vi.spyOn(mod, 'envConfig', 'get').mockReturnValue({
      ...original,
      JWT_ACCESS_SECRET: '',
    } as any)

    await expect(generateAccessToken(payload)).rejects.toMatchObject({ name: 'NotFoundError' })
  })

  it('throws NotFoundError if JWT_REFRESH_SECRET is missing for refresh token generation', async () => {
    const mod = await import('@/env')
    const original = { ...mod.envConfig }
    vi.spyOn(mod, 'envConfig', 'get').mockReturnValue({
      ...original,
      JWT_REFRESH_SECRET: '',
    } as any)

    await expect(generateRefreshToken(payload)).rejects.toMatchObject({ name: 'NotFoundError' })
  })

  it('returns null for an already expired token', async () => {
    // Create a token with very short expiration by temporarily mocking SignJWT
    const { SignJWT } = await import('jose')
    // Instead of mocking SignJWT, generate real token with immediate expiry by using jose directly
    const { SignJWT: RealSignJWT } = await (await import('jose'))

    // Access secret from envConfig
    const { envConfig } = await import('@/env')
    const enc = new TextEncoder().encode(envConfig.JWT_ACCESS_SECRET!)

    const expired = await new RealSignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('0s')
      .sign(enc)

    const res = await verifyToken(expired)
    expect(res).toBeNull()
  })
})
