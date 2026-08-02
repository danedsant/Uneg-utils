import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import EditIcon from '@mui/icons-material/Edit'
import { useProgressStore } from '../store/progressStore'
import { computeProgress } from '../utils/pensumLogic'
import { requirements } from '../data/requisitos'
import ProgressGauge from '../components/ProgressGauge'

export default function Dashboard() {
  const statuses = useProgressStore((s) => s.statuses)
  const grades = useProgressStore((s) => s.grades)
  const requirementsState = useProgressStore((s) => s.requirements)
  const nombre = useProgressStore((s) => s.nombre)
  const openProfileModal = useProgressStore((s) => s.openProfileModal)
  const stats = useMemo(() => computeProgress(statuses, grades), [statuses, grades])

  const chartData = stats.perSemester.map((p) => ({
    semestre: `Sem ${p.semestre}`,
    Aprobadas: p.approvedUC,
    Pendientes: p.totalUC - p.approvedUC,
  }))

  const doneRequirements = requirements.filter((r) => requirementsState[r.id])

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h4">
          {nombre ? `Estatus de ${nombre}` : 'Mi estatus'}
        </Typography>
        <IconButton
          size="small"
          color="primary"
          onClick={openProfileModal}
          aria-label="Editar nombre o importar progreso"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Resumen de tu avance en la carrera de Ingeniería en Informática (Plan 5, 178 UC).
      </Typography>

      {stats.approvedSubjects === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aún no has marcado materias aprobadas. Ve a la sección{' '}
          <Button component={RouterLink} to="/pensum" size="small" sx={{ verticalAlign: 'baseline', textTransform: 'none' }}>
            Pensum
          </Button>{' '}
          para registrar tu avance y calcular tu estatus.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Avance general" />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <ProgressGauge
                value={stats.pct}
                caption={`${stats.approvedUC} / ${stats.totalUC} UC aprobadas`}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
                <Chip label={`${stats.approvedSubjects} / ${stats.totalSubjects} materias`} variant="outlined" />
                {stats.promedioPonderado !== null && (
                  <Chip
                    label={`Promedio general: ${stats.promedioPonderado.toFixed(2)}`}
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {stats.currentSemester && (
                  <Chip
                    label={`Semestre actual: ${stats.currentSemester}`}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary" align="center">
                Te faltan {stats.totalUC - stats.approvedUC} UC para completar el plan.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="UC por semestre" />
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="semestre" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Aprobadas" stackId="a" fill="#2020B0" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pendientes" stackId="a" fill="#DDE1F0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Disponibles para inscribir"
              subheader="Prelaciones cumplidas y sin cursar, ordenadas por semestre"
              action={
                <Button component={RouterLink} to="/prelaciones" size="small">
                  Ver prelaciones
                </Button>
              }
            />
            <CardContent>
              {stats.availableSubjects.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  No hay materias inscribibles con tu avance actual.
                </Typography>
              ) : (
                <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                  {[...stats.availableSubjects]
                    .sort((a, b) => a.semestre - b.semestre || a.codigo.localeCompare(b.codigo))
                    .map((s) => (
                      <Chip key={s.codigo} size="small" label={`${s.codigo} · Sem ${s.semestre} · ${s.nombre}`} color="primary" variant="outlined" />
                    ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Promedios por semestre"
              subheader="Ponderado por UC de las materias aprobadas con nota"
            />
            <CardContent>
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                {stats.perSemester.map((p) => (
                  <Chip
                    key={p.semestre}
                    size="small"
                    label={`Sem ${p.semestre}: ${p.promedio !== null ? p.promedio.toFixed(2) : '—'}`}
                    color={p.promedio !== null ? 'secondary' : 'default'}
                    variant={p.promedio !== null ? 'outlined' : 'filled'}
                  />
                ))}
              </Stack>
              {stats.promedioPonderado === null && (
                <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
                  Registra notas en las materias aprobadas (sección Pensum) para ver tus promedios.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="En curso"
              subheader="Materias que estás cursando"
              action={
                <Button component={RouterLink} to="/pensum" size="small">
                  Editar
                </Button>
              }
            />
            <CardContent>
              {stats.inProgressSubjects.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  No tienes materias marcadas como cursando.
                </Typography>
              ) : (
                <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                  {stats.inProgressSubjects.map((s) => (
                    <Chip key={s.codigo} size="small" label={`${s.codigo} · ${s.nombre}`} color="warning" variant="outlined" />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Requisitos de grado"
              subheader={`${doneRequirements.length} de ${requirements.length} cumplidos`}
              action={
                <Button component={RouterLink} to="/requisitos" size="small">
                  Ver todos
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(doneRequirements.length / requirements.length) * 100}
                />
              </Box>
              <Grid container spacing={1}>
                {requirements.map((r) => {
                  const done = requirementsState[r.id]
                  return (
                    <Grid item xs={12} sm={6} key={r.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {done ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                        )}
                        <Typography variant="body2">{r.nombre}</Typography>
                        <Chip
                          size="small"
                          label={done ? 'Cumplido' : 'Pendiente'}
                          color={done ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Stack>
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
