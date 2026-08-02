import { CARRERA, PLAN } from '../data/pensum'
import type { SubjectStatus } from '../types'
import type { ImportedProgress } from '../store/progressStore'

export interface ExportPayload {
  app: string
  version: number
  plan: string
  exportado: string
  data: ImportedProgress
}

export function buildExport(
  nombre: string,
  statuses: Record<string, SubjectStatus>,
  grades: Record<string, number>,
  requirements: Record<string, boolean>
): ExportPayload {
  return {
    app: 'uneg-utils',
    version: 1,
    plan: `${CARRERA} · Plan ${PLAN}`,
    exportado: new Date().toISOString(),
    data: { nombre, statuses, grades, requirements },
  }
}

export function validateExport(raw: unknown): ImportedProgress | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  const data = r.data
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>

  if (typeof d.statuses !== 'object' || d.statuses === null) return null
  const statuses: Record<string, SubjectStatus> = {}
  for (const [k, v] of Object.entries(d.statuses as Record<string, unknown>)) {
    if (v !== 'approved' && v !== 'inProgress' && v !== 'none') return null
    statuses[k] = v
  }

  if (typeof d.grades !== 'object' || d.grades === null) return null
  const grades: Record<string, number> = {}
  for (const [k, v] of Object.entries(d.grades as Record<string, unknown>)) {
    if (typeof v !== 'number' || !Number.isFinite(v)) return null
    grades[k] = v
  }

  if (typeof d.requirements !== 'object' || d.requirements === null) return null
  const requirements: Record<string, boolean> = {}
  for (const [k, v] of Object.entries(d.requirements as Record<string, unknown>)) {
    if (typeof v !== 'boolean') return null
    requirements[k] = v
  }

  return {
    nombre: typeof d.nombre === 'string' ? d.nombre : '',
    statuses,
    grades,
    requirements,
  }
}
