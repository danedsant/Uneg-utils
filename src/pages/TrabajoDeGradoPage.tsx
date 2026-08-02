import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorIcon from '@mui/icons-material/Error'
import { fasesTfg, notaTfg, plazosClave } from '../data/trabajoDeGrado'
import type { VeredictoTipo } from '../data/trabajoDeGrado'

const veredictoIcon = (tipo: VeredictoTipo) => {
  if (tipo === 'success') return <CheckCircleIcon />
  if (tipo === 'warning') return <WarningAmberIcon />
  return <ErrorIcon />
}

export default function TrabajoDeGradoPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Trabajo de Grado
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Proceso de Trabajo Especial de Grado (TEG) conforme al flujo oficial de la Comisión de Trabajo de Grado de
        la UNEG, en 5 fases.
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Plazos clave
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {plazosClave.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p.etiqueta}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <ScheduleIcon fontSize="small" color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    {p.etiqueta}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" fontWeight={600} color="primary">
                  {p.valor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {fasesTfg.map((fase) => (
          <Card key={fase.numero}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>{fase.numero}</Avatar>
              }
              title={`Fase ${fase.numero}: ${fase.titulo}`}
              action={<Chip label={fase.articulos} size="small" variant="outlined" />}
            />
            <CardContent>
              <Stack direction="column" spacing={2}>
                {fase.pasos.map((paso, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      variant="rounded"
                      sx={{ width: 26, height: 26, fontSize: 13, bgcolor: 'grey.400' }}
                    >
                      {i + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{paso.texto}</Typography>
                      {(paso.plazos?.length ?? 0) > 0 && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                          {paso.plazos!.map((pl) => (
                            <Chip
                              key={pl}
                              size="small"
                              icon={<ScheduleIcon />}
                              label={pl}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      )}
                      {(paso.veredictos?.length ?? 0) > 0 && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                          {paso.veredictos!.map((v) => (
                            <Chip
                              key={v.etiqueta}
                              size="small"
                              icon={veredictoIcon(v.tipo)}
                              label={v.etiqueta}
                              color={v.tipo}
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        {notaTfg}
      </Alert>
    </Box>
  )
}
