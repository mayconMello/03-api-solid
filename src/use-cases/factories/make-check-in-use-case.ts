import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(
    prismaCheckInsRepository,
    gymsRepository,
  )

  return checkInUseCase
}
