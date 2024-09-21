import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javscript Gym',
        latitude: 23.5506254,
        longitude: -46.6330654,
      },
    })

    const createGymResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 23.5506254,
        longitude: -46.6330654,
      })

    expect(createGymResponse.statusCode).toEqual(201)
  })
})
