import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create user a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '55119994561123',
        latitude: 23.5506254,
        longitude: -46.6330654,
      })

    expect(createGymResponse.statusCode).toEqual(201)
  })
})
