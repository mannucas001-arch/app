import type { Breed, Tutor } from '../types'

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(`${value}T12:00:00`))
}

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function getTutorName(tutors: Tutor[], tutorId: string) {
  return tutors.find((tutor) => tutor.id === tutorId)?.name || 'Tutor não encontrado'
}

export function getBreedName(breeds: Breed[], breedId: string) {
  return breeds.find((breed) => breed.id === breedId)?.name || 'Raça não encontrada'
}
