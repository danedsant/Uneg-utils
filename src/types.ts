export interface Subject {
  codigo: string
  nombre: string
  semestre: number
  uc: number
  prelaciones: string[]
}

export interface Electiva {
  codigo: string
  nombre: string
  uc: number
}

export type SubjectStatus = 'approved' | 'inProgress' | 'none'

export type DisplayStatus = 'approved' | 'inProgress' | 'available' | 'pending'

export type RequirementId =
  | 'servicio-comunitario'
  | 'taller-desarrollo-humano'
  | 'pasantia'
  | 'trabajo-especial-de-grado'

export interface Requirement {
  id: RequirementId
  codigo: string
  nombre: string
  descripcion: string
  uc?: number
  semestre?: number
  prelacion?: string
}
