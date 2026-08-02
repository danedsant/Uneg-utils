import { Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import CheckIcon from '@mui/icons-material/Check'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { getSubject } from '../utils/pensumLogic'
import type { DisplayStatus, Subject, SubjectStatus } from '../types'
import StatusChip from './StatusChip'

interface Props {
  subject: Subject
  statuses: Record<string, SubjectStatus>
  grades: Record<string, number>
  displayStatus: DisplayStatus
  onSetStatus: (codigo: string, status: SubjectStatus) => void
  onSetGrade: (codigo: string, nota: number | null) => void
}

export default function SubjectCard({ subject, statuses, grades, displayStatus, onSetStatus, onSetGrade }: Props) {
  const isApproved = displayStatus === 'approved'
  const isInProgress = displayStatus === 'inProgress'

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Chip label={subject.codigo} size="small" variant="outlined" />
          <Chip label={`${subject.uc} UC`} size="small" color="primary" variant="outlined" />
        </Stack>

        <Tooltip title={subject.nombre} placement="top">
          <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.25 }}>
            {subject.nombre}
          </Typography>
        </Tooltip>

        <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.5}>
          {subject.prelaciones.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              Sin prelaciones
            </Typography>
          ) : (
            subject.prelaciones.map((p) => {
              const pre = getSubject(p)
              const met = statuses[p] === 'approved'
              return (
                <Tooltip key={p} title={pre ? pre.nombre : p}>
                  <Chip
                    size="small"
                    label={p}
                    color={met ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Tooltip>
              )
            })
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: 'auto' }}
        >
          <StatusChip status={displayStatus} />
          {isApproved && (
            <TextField
              size="small"
              type="number"
              label="Nota"
              value={grades[subject.codigo] !== undefined ? String(grades[subject.codigo]) : ''}
              onChange={(e) => {
                const v = e.target.value.trim()
                if (v === '') {
                  onSetGrade(subject.codigo, null)
                  return
                }
                const n = parseFloat(v)
                if (!Number.isNaN(n)) onSetGrade(subject.codigo, Math.min(20, Math.max(0, n)))
              }}
              inputProps={{ min: 0, max: 20, step: 0.5 }}
              sx={{ width: 82 }}
            />
          )}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Marcar como aprobada">
              <span>
                <CheckIcon
                  fontSize="small"
                  color={isApproved ? 'success' : 'disabled'}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isApproved ? 'success.main' : 'divider',
                    p: 0.5,
                    boxSizing: 'content-box',
                  }}
                  onClick={() => onSetStatus(subject.codigo, isApproved ? 'none' : 'approved')}
                />
              </span>
            </Tooltip>
            <Tooltip title="Marcar como cursando">
              <span>
                <ScheduleIcon
                  fontSize="small"
                  color={isInProgress ? 'warning' : 'disabled'}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isInProgress ? 'warning.main' : 'divider',
                    p: 0.5,
                    boxSizing: 'content-box',
                  }}
                  onClick={() => onSetStatus(subject.codigo, isInProgress ? 'none' : 'inProgress')}
                />
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
