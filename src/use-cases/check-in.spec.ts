import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/use-cases/erros/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/use-cases/erros/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(23.5429495),
      longitude: new Decimal(-46.6331956),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23.5429495,
      userLongitude: -46.6331956,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to create check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23.5429495,
      userLongitude: -46.6331956,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 23.5429495,
        userLongitude: -46.6331956,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23.5429495,
      userLongitude: -46.6331956,
    })

    vi.setSystemTime(new Date(2022, 0, 12, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23.5429495,
      userLongitude: -46.6331956,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(23.5506254),
      longitude: new Decimal(-46.6330654),
    })
    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0))
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 23.5429495,
        userLongitude: -46.6331956,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
