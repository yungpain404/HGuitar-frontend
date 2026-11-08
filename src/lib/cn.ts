type ClassDictionary = Record<string, boolean | null | undefined>

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassDictionary
  | ClassValue[]

/**
 * Joins conditional class names. A small local replacement for `clsx` so the
 * build does not depend on an extra runtime package.
 */
export function cn(...values: ClassValue[]): string {
  const classes: string[] = []

  const add = (value: ClassValue): void => {
    if (value === null || value === undefined || value === false || value === '') return

    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value))
      return
    }

    if (Array.isArray(value)) {
      value.forEach(add)
      return
    }

    for (const [name, enabled] of Object.entries(value)) {
      if (enabled) classes.push(name)
    }
  }

  values.forEach(add)
  return classes.join(' ')
}
