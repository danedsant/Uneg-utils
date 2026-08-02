export type VeredictoTipo = 'success' | 'warning' | 'error'

export interface Veredicto {
  etiqueta: string
  tipo: VeredictoTipo
}

export interface PasoTfG {
  texto: string
  plazos?: string[]
  veredictos?: Veredicto[]
}

export interface FaseTfG {
  numero: number
  titulo: string
  articulos: string
  pasos: PasoTfG[]
}

export const fasesTfg: FaseTfG[] = [
  {
    numero: 1,
    titulo: 'Entrega de la propuesta',
    articulos: 'Art. 18 al 22',
    pasos: [
      {
        texto:
          'El estudiante entrega la propuesta de Trabajo de Grado (2 ejemplares, entre 6 y 10 páginas) en la Coordinación de Proyecto de Carrera (CPC).',
        plazos: ['6–10 páginas'],
      },
      {
        texto: 'La CPC entrega la propuesta al Comité de Trabajo de Grado (CTG).',
      },
    ],
  },
  {
    numero: 2,
    titulo: 'Evaluación de la propuesta',
    articulos: 'Art. 23 al 25',
    pasos: [
      {
        texto: 'El CTG revisa la propuesta: con tutor académico o, sin tutor, asigna uno.',
      },
      {
        texto: 'El CTG evalúa la propuesta.',
        veredictos: [
          { etiqueta: 'Aprobado', tipo: 'success' },
          { etiqueta: 'Devuelta para mejoras', tipo: 'warning' },
          { etiqueta: 'Negada', tipo: 'error' },
        ],
      },
      {
        texto: 'El CTG entrega la decisión a la CPC.',
        plazos: ['15 días hábiles'],
      },
      {
        texto:
          'La CPC entrega la propuesta al estudiante, quien tendrá 120 días continuos para elaborar el Trabajo de Grado.',
        plazos: ['120 días continuos'],
      },
    ],
  },
  {
    numero: 3,
    titulo: 'Elaboración y evaluación del Trabajo de Grado',
    articulos: 'Art. 26 al 35',
    pasos: [
      {
        texto:
          'El estudiante elabora el Trabajo de Grado dentro del plazo. Pasados los 120 días, puede solicitar prórroga al CTG.',
        plazos: ['120 días continuos', 'Prórroga hasta 30 días continuos'],
      },
      {
        texto:
          'El estudiante entrega 3 ejemplares encuadernados a la CPC, con constancia de aprobación del tutor académico.',
        plazos: ['Máx. 100 páginas de desarrollo'],
      },
      {
        texto: 'La CPC entrega el Trabajo de Grado al CTG; el CTG asigna jurado y la CPC lo entrega al jurado.',
      },
      {
        texto: 'El jurado revisa y evalúa el Trabajo de Grado.',
        plazos: ['15 días hábiles'],
        veredictos: [
          { etiqueta: 'Aprobado: presentación oral y pública', tipo: 'success' },
          { etiqueta: 'Devuelto para mejoras (30 días continuos)', tipo: 'warning' },
          { etiqueta: 'Reprobado (60 días continuos)', tipo: 'error' },
        ],
      },
      {
        texto:
          'El estudiante entrega a la CPC un ejemplar original empastado y un ejemplar digitalizado, y el jurado asigna la fecha de defensa.',
      },
    ],
  },
  {
    numero: 4,
    titulo: 'Defensa oral',
    articulos: 'Art. 36 al 38',
    pasos: [
      {
        texto: 'El estudiante realiza la presentación oral y pública ante el jurado, previa aprobación del Trabajo de Grado.',
      },
      {
        texto: 'Veredicto posterior a la presentación oral.',
        veredictos: [
          { etiqueta: 'Aprobado', tipo: 'success' },
          { etiqueta: 'Devuelto para mejoras (30 días continuos)', tipo: 'warning' },
          { etiqueta: 'Reprobado (60 días continuos)', tipo: 'error' },
        ],
      },
      {
        texto: 'El jurado entrega el acta a la CPC.',
      },
    ],
  },
  {
    numero: 5,
    titulo: 'Acto de Grado',
    articulos: 'Art. 39 y 40',
    pasos: [
      {
        texto: 'El estudiante solicita el Acto de Grado.',
      },
    ],
  },
]

export const plazosClave = [
  { etiqueta: 'Elaboración del TG', valor: '120 días continuos' },
  { etiqueta: 'Prórroga máxima', valor: '30 días continuos' },
  { etiqueta: 'Evaluación de propuesta (CTG)', valor: '15 días hábiles' },
  { etiqueta: 'Veredicto del jurado', valor: '15 días hábiles' },
  { etiqueta: 'Correcciones (mejoras)', valor: '30 días continuos' },
  { etiqueta: 'Correcciones (reprobado)', valor: '60 días continuos' },
  { etiqueta: 'Extensión de la propuesta', valor: '6–10 páginas' },
  { etiqueta: 'Extensión del TG', valor: 'máx. 100 páginas' },
]

export const notaTfg =
  'COMISIÓN DE TRABAJO DE GRADO (UNEG): toda solicitud debe ser canalizada a través de las Coordinaciones de Proyecto de cada Carrera.'
