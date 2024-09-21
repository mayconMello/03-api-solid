import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '@/use-cases/serch-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository)

  return searchGymsUseCase
}
