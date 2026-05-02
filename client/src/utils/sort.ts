export type Order = 'asc' | 'desc'

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const valueA = a[orderBy]
  const valueB = b[orderBy]

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueB - valueA
  }

  const aStr = String(valueA).toLowerCase()
  const bStr = String(valueB).toLowerCase()

  if (bStr < aStr) return -1
  if (bStr > aStr) return 1
  return 0
}

export function getComparator<T>(order: Order, orderBy: keyof T) {
  return (a: T, b: T) => {
    const comp = descendingComparator(a, b, orderBy)
    return order === 'desc' ? comp : -comp
  }
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as const)
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilized.map((el) => el[0])
}
