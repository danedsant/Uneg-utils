import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubjectStatus } from '../types'

export interface ImportedProgress {
  nombre: string
  statuses: Record<string, SubjectStatus>
  grades: Record<string, number>
  requirements: Record<string, boolean>
}

interface ProgressState {
  statuses: Record<string, SubjectStatus>
  grades: Record<string, number>
  requirements: Record<string, boolean>
  nombre: string
  setStatus: (codigo: string, status: SubjectStatus) => void
  setGrade: (codigo: string, nota: number | null) => void
  setNombre: (nombre: string) => void
  toggleRequirement: (id: string) => void
  importState: (payload: ImportedProgress) => void
  resetAll: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      statuses: {},
      grades: {},
      requirements: {},
      nombre: '',
      setStatus: (codigo, status) =>
        set((state) => ({ statuses: { ...state.statuses, [codigo]: status } })),
      setGrade: (codigo, nota) =>
        set((state) => {
          const grades = { ...state.grades }
          if (nota === null) delete grades[codigo]
          else grades[codigo] = nota
          return { grades }
        }),
      setNombre: (nombre) => set({ nombre }),
      toggleRequirement: (id) =>
        set((state) => ({ requirements: { ...state.requirements, [id]: !state.requirements[id] } })),
      importState: (payload) =>
        set({
          nombre: payload.nombre,
          statuses: payload.statuses,
          grades: payload.grades,
          requirements: payload.requirements,
        }),
      resetAll: () => set({ statuses: {}, grades: {}, requirements: {} }),
    }),
    { name: 'uneg-utils-progress', version: 1 }
  )
)
