import { useMemo, useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { subjects } from '../data/pensum'
import type { Subject, SubjectStatus } from '../types'
import { prelacionesMet, statusOf } from '../utils/pensumLogic'
import StatusChip from './StatusChip'

interface Props {
  statuses: Record<string, SubjectStatus>
  onToggle: (codigo: string) => void
}

const HEADER_W = 84
const NODE_W = 150
const NODE_H = 64
const GAP_X = 20
const ROW_H = 142
const TOP_TITLE = 46
const MARGIN_LEFT = 10
const MARGIN_RIGHT = 20
const MARGIN_BOTTOM = 26

const MAX_COUNT = 7
const ROW_W = MAX_COUNT * NODE_W + (MAX_COUNT - 1) * GAP_X
const VIEW_W = HEADER_W + MARGIN_LEFT + ROW_W + MARGIN_RIGHT
const VIEW_H = TOP_TITLE + 9 * ROW_H + MARGIN_BOTTOM

const nodeColors: Record<string, { fill: string; stroke: string; text: string }> = {
  approved: { fill: '#2E7D32', stroke: '#1B5E20', text: '#FFFFFF' },
  inProgress: { fill: '#ED6C02', stroke: '#C45E00', text: '#FFFFFF' },
  available: { fill: '#2020B0', stroke: '#15157A', text: '#FFFFFF' },
  pending: { fill: '#F5F5F5', stroke: '#BDBDBD', text: '#616161' },
}

function wrapName(name: string, maxChars = 27, maxLines = 2): string[] {
  const words = name.split(' ')
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if (current && `${current} ${w}`.length > maxChars) {
      lines.push(current)
      current = w
      if (lines.length === maxLines) break
    } else {
      current = current ? `${current} ${w}` : w
    }
  }
  if (current) {
    if (lines.length < maxLines) {
      lines.push(current)
    } else {
      lines[lines.length - 1] = `${lines[lines.length - 1]} ${current}`.slice(0, maxChars - 1).trimEnd() + '…'
    }
  }
  return lines
}

interface Edge {
  d: string
  fromApproved: boolean
  source: string
  target: string
}

export default function PrelacionesGraph({ statuses, onToggle }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const pos = useMemo(() => {
    const groups = new Map<number, Subject[]>()
    for (const s of subjects) {
      const arr = groups.get(s.semestre) ?? []
      arr.push(s)
      groups.set(s.semestre, arr)
    }
    const p = new Map<string, { x: number; y: number }>()
    for (let sem = 1; sem <= 9; sem++) {
      const list = groups.get(sem) ?? []
      const rowW = list.length * NODE_W + Math.max(0, list.length - 1) * GAP_X
      const x0 = HEADER_W + MARGIN_LEFT + (ROW_W - rowW) / 2
      list.forEach((s, i) => {
        p.set(s.codigo, {
          x: x0 + i * (NODE_W + GAP_X),
          y: TOP_TITLE + (sem - 1) * ROW_H + (ROW_H - NODE_H) / 2,
        })
      })
    }
    return p
  }, [])

  const groups = useMemo(() => {
    const g = new Map<number, Subject[]>()
    for (const s of subjects) {
      const arr = g.get(s.semestre) ?? []
      arr.push(s)
      g.set(s.semestre, arr)
    }
    return g
  }, [])

  const ucBySem = useMemo(() => {
    const m = new Map<number, number>()
    for (const s of subjects) m.set(s.semestre, (m.get(s.semestre) ?? 0) + s.uc)
    return m
  }, [])

  const displayStatusOf = (s: Subject): keyof typeof nodeColors => {
    const st = statusOf(s, statuses)
    if (st === 'approved') return 'approved'
    if (st === 'inProgress') return 'inProgress'
    if (prelacionesMet(s, statuses)) return 'available'
    return 'pending'
  }

  const edges = useMemo<Edge[]>(() => {
    const list: Edge[] = []
    for (const s of subjects) {
      const sub = pos.get(s.codigo)
      if (!sub) continue
      for (const p of s.prelaciones) {
        const pre = pos.get(p)
        if (!pre) continue
        const gy = sub.y - 24
        list.push({
          d: `M ${pre.x + NODE_W / 2} ${pre.y + NODE_H} V ${gy} H ${sub.x + NODE_W / 2} V ${sub.y}`,
          fromApproved: statuses[p] === 'approved',
          source: p,
          target: s.codigo,
        })
      }
    }
    return list
  }, [pos, statuses])

  const connected = useMemo(() => {
    if (!hovered) return new Set<string>()
    const set = new Set<string>([hovered])
    for (const e of edges) {
      if (e.source === hovered) set.add(e.target)
      if (e.target === hovered) set.add(e.source)
    }
    return set
  }, [hovered, edges])

  const scrollToSem = (sem: number) => {
    document.getElementById(`sem-${sem}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const rowLabelY = (sem: number) => TOP_TITLE + (sem - 1) * ROW_H + ROW_H / 2

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={1.5}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <StatusChip status="approved" size="small" />
          <StatusChip status="inProgress" size="small" />
          <StatusChip status="available" size="small" />
          <StatusChip status="pending" size="small" />
        </Stack>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ ml: { md: 'auto' } }}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((sem) => (
            <Chip key={sem} size="small" label={`Sem ${sem}`} variant="outlined" onClick={() => scrollToSem(sem)} />
          ))}
        </Stack>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          style={{ minWidth: 1000, height: 'auto', display: 'block' }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#BDBDBD" />
            </marker>
            <marker
              id="arrow-green"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4CAF50" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const highlighted = hovered !== null && (e.source === hovered || e.target === hovered)
            const dimmed = hovered !== null && !highlighted
            return (
              <path
                key={i}
                d={e.d}
                fill="none"
                stroke={e.fromApproved ? '#4CAF50' : '#BDBDBD'}
                strokeWidth={highlighted ? 2.6 : e.fromApproved ? 2 : 1.2}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={dimmed ? 0.1 : highlighted ? 1 : 0.9}
                markerEnd={`url(#${e.fromApproved ? 'arrow-green' : 'arrow'})`}
              />
            )
          })}

          {Array.from(groups.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([sem, list]) => {
              const y = rowLabelY(sem)
              return (
                <g key={`row-${sem}`} id={`sem-${sem}`}>
                  <text x={HEADER_W / 2} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2020B0">
                    Sem {sem}
                  </text>
                  <text x={HEADER_W / 2} y={y + 12} textAnchor="middle" fontSize="10" fill="#757575">
                    {ucBySem.get(sem) ?? 0} UC
                  </text>
                  {list.map((s) => {
                    const { x, y: ny } = pos.get(s.codigo)!
                    const status = displayStatusOf(s)
                    const c = nodeColors[status]
                    const lines = wrapName(s.nombre)
                    const dimmed = hovered !== null && !connected.has(s.codigo)
                    return (
                      <g
                        key={s.codigo}
                        onClick={() => onToggle(s.codigo)}
                        onMouseEnter={() => setHovered(s.codigo)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ cursor: 'pointer' }}
                        opacity={dimmed ? 0.25 : 1}
                      >
                        <title>{`${s.codigo} · ${s.nombre} · ${s.uc} UC`}</title>
                        <rect
                          x={x}
                          y={ny}
                          width={NODE_W}
                          height={NODE_H}
                          rx={10}
                          fill={c.fill}
                          stroke={c.stroke}
                          strokeWidth={1.5}
                        />
                        <text x={x + 12} y={ny + 19} fontSize="10" fontWeight="700" fill={c.text}>
                          {s.codigo}
                        </text>
                        <text x={x + NODE_W - 12} y={ny + 19} fontSize="9.5" textAnchor="end" fill={c.text}>
                          {s.uc} UC
                        </text>
                        {lines.map((line, i) => (
                          <text key={i} x={x + 12} y={ny + 37 + i * 15} fontSize="9.5" fill={c.text}>
                            {line}
                          </text>
                        ))}
                      </g>
                    )
                  })}
                </g>
              )
            })}
        </svg>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Se lee de arriba hacia abajo (Semestre 1 → 9). Las flechas recorren los pasillos entre semestres: la materia
        debe aprobarse antes de cursar la siguiente; las verdes provienen de materias ya aprobadas. Pasa el cursor
        sobre una materia para aislar sus prelaciones.
      </Typography>
    </Box>
  )
}
