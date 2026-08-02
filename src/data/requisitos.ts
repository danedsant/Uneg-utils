import type { Requirement } from '../types'

export const requirements: Requirement[] = [
  {
    id: 'servicio-comunitario',
    codigo: '4000101',
    nombre: 'Servicio Comunitario',
    descripcion:
      'Cumplimiento de la Ley de Servicio Comunitario del Estudiante de Educación Superior (120 horas de servicio acreditadas ante la universidad).',
    prelacion: '11 UC aprobadas',
  },
  {
    id: 'taller-desarrollo-humano',
    codigo: '3000000',
    nombre: 'Taller de Desarrollo Humano y Participación Comunitaria',
    descripcion: 'Taller requerido como requisito de grado, sin unidades de crédito asociadas.',
    prelacion: '11 UC aprobadas',
  },
  {
    id: 'pasantia',
    codigo: '2472746',
    nombre: 'Pasantía',
    descripcion: 'Pasantía empresarial cursada en el 7.º semestre del plan de estudios.',
    uc: 3,
    semestre: 7,
  },
  {
    id: 'trabajo-especial-de-grado',
    codigo: '2472957',
    nombre: 'Trabajo Especial de Grado',
    descripcion:
      'Culminación del proceso de Trabajo de Grado conforme al flujo de la Comisión de Trabajo de Grado (ver sección Trabajo de Grado).',
    semestre: 9,
  },
]
