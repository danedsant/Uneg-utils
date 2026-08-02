import { subjects, TOTAL_UC } from '../data/pensum'
import type { Subject, SubjectStatus } from '../types'

export const getSubject = (codigo: string): Subject | undefined =>
  subjects.find((s) => s.codigo === codigo)

export const statusOf = (
  subject: Subject,
  statuses: Record<string, SubjectStatus>
): SubjectStatus => statuses[subject.codigo] ?? 'none'

export const prelacionesMet = (
  subject: Subject,
  statuses: Record<string, SubjectStatus>
): boolean => subject.prelaciones.every((p) => statuses[p] === 'approved')

export const getAvailableSubjects = (
  statuses: Record<string, SubjectStatus>
): Subject[] =>
  subjects
    .filter(
      (s) =>
        statuses[s.codigo] !== 'approved' &&
        statuses[s.codigo] !== 'inProgress' &&
        prelacionesMet(s, statuses)
    )
    .sort((a, b) => a.semestre - b.semestre || a.codigo.localeCompare(b.codigo))

export const promedioPonderado = (
  list: Subject[],
  statuses: Record<string, SubjectStatus>,
  grades: Record<string, number>
): number | null => {
  let sum = 0
  let weight = 0
  for (const s of list) {
    if (statuses[s.codigo] !== 'approved') continue
    const g = grades[s.codigo]
    if (typeof g !== 'number' || !Number.isFinite(g)) continue
    sum += g * s.uc
    weight += s.uc
  }
  return weight > 0 ? sum / weight : null
}

export interface SemesterStats {
  semestre: number
  totalUC: number
  approvedUC: number
  promedio: number | null
}

export interface ProgressStats {
  totalUC: number
  approvedUC: number
  pct: number
  totalSubjects: number
  approvedSubjects: number
  inProgressSubjects: Subject[]
  availableSubjects: Subject[]
  perSemester: SemesterStats[]
  currentSemester: number | null
  promedioPonderado: number | null
}

export function computeProgress(
  statuses: Record<string, SubjectStatus>,
  grades: Record<string, number>
): ProgressStats {
  let approvedUC = 0
  let approvedSubjects = 0
  const inProgressSubjects: Subject[] = []
  const perSemester: SemesterStats[] = []

  for (let sem = 1; sem <= 9; sem++) {
    const semSubjects = subjects.filter((s) => s.semestre === sem)
    const semUC = semSubjects.reduce((acc, s) => acc + s.uc, 0)
    const semApprovedUC = semSubjects.reduce(
      (acc, s) => acc + (statuses[s.codigo] === 'approved' ? s.uc : 0),
      0
    )
    approvedUC += semApprovedUC
    approvedSubjects += semSubjects.filter(
      (s) => statuses[s.codigo] === 'approved'
    ).length
    perSemester.push({
      semestre: sem,
      totalUC: semUC,
      approvedUC: semApprovedUC,
      promedio: promedioPonderado(semSubjects, statuses, grades),
    })
  }

  for (const s of subjects) {
    if (statuses[s.codigo] === 'inProgress') inProgressSubjects.push(s)
  }

  const incomplete = perSemester.find((p) => p.approvedUC < p.totalUC)

  return {
    totalUC: TOTAL_UC,
    approvedUC,
    pct: Math.round((approvedUC / TOTAL_UC) * 1000) / 10,
    totalSubjects: subjects.length,
    approvedSubjects,
    inProgressSubjects,
    availableSubjects: getAvailableSubjects(statuses),
    perSemester,
    currentSemester: incomplete?.semestre ?? null,
    promedioPonderado: promedioPonderado(subjects, statuses, grades),
  }
}
