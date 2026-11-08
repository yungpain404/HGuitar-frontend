export interface ChordFinger {
  /** Guitar string number: 1 = high E, 6 = low E. */
  string: number
  /** -1 = muted, 0 = open, positive = fret number. */
  fret: number
  /** Optional left-hand finger number (1–4). */
  finger?: number
}

function toFinger(value: unknown): ChordFinger | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const stringNumber = record.string
  const fret = record.fret

  if (typeof stringNumber !== 'number' || !Number.isInteger(stringNumber) || stringNumber < 1 || stringNumber > 6) {
    return null
  }
  if (typeof fret !== 'number' || !Number.isInteger(fret) || fret < -1 || fret > 24) {
    return null
  }

  return {
    string: stringNumber,
    fret,
    finger:
      typeof record.finger === 'number' && Number.isInteger(record.finger) && record.finger >= 1 && record.finger <= 4
        ? record.finger
        : undefined,
  }
}

/**
 * Parses the `fingersJson` field returned by the API. The payload is treated as
 * untrusted data: every entry is validated and invalid entries are dropped.
 */
export function parseChordFingers(json: string | null | undefined): ChordFinger[] {
  if (!json) return []

  try {
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      const finger = toFinger(item)
      return finger ? [finger] : []
    })
  } catch {
    return []
  }
}

export function parseMetadata(json: string | null | undefined): Record<string, unknown> | null {
  if (!json) return null

  try {
    const parsed: unknown = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Converts a diagram block payload into finger positions.
 * Supported shapes:
 *   { fingers: [{ string, fret, finger }] }
 *   { frets: [6, 5, 4, 3, 2, 1] }  // read left-to-right from low E to high E
 */
export function fingersFromMetadata(metadata: Record<string, unknown> | null): ChordFinger[] {
  if (!metadata) return []

  if (Array.isArray(metadata.fingers)) {
    return metadata.fingers.flatMap((item) => {
      const finger = toFinger(item)
      return finger ? [finger] : []
    })
  }

  if (Array.isArray(metadata.frets) && metadata.frets.length === 6) {
    return metadata.frets.flatMap((fret, index) => {
      if (typeof fret !== 'number' || !Number.isInteger(fret) || fret < -1 || fret > 24) return []
      // index 0 is the leftmost string in a chord chart = string 6.
      return [{ string: 6 - index, fret }]
    })
  }

  return []
}
