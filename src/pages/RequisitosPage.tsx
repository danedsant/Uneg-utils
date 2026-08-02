import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { requirements } from '../data/requisitos'
import { electivas } from '../data/electivas'
import { useProgressStore } from '../store/progressStore'

export default function RequisitosPage() {
  const requirementsState = useProgressStore((s) => s.requirements)
  const toggleRequirement = useProgressStore((s) => s.toggleRequirement)

  const doneCount = requirements.filter((r) => requirementsState[r.id]).length

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Requisitos de grado
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Checklist de los requisitos para optar al título de Ingeniero(a) en Informática, además de completar las
        178 UC del plan de estudios.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6">
              {doneCount} de {requirements.length} requisitos cumplidos
            </Typography>
            <Chip label={`178 UC del plan`} color="primary" variant="outlined" />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(doneCount / requirements.length) * 100}
            sx={{ height: 8, borderRadius: 2 }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {requirements.map((r) => {
          const done = !!requirementsState[r.id]
          return (
            <Grid item xs={12} md={6} key={r.id}>
              <Card sx={{ opacity: done ? 0.75 : 1 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox checked={done} onChange={() => toggleRequirement(r.id)} color="success" />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ textDecoration: done ? 'line-through' : 'none' }}>
                          {r.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.descripcion}
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', mx: 0 }}
                  />
                  <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.5} sx={{ mt: 1.5, pl: 5.5 }}>
                    <Chip size="small" label={r.codigo} variant="outlined" />
                    {r.uc !== undefined && <Chip size="small" label={`${r.uc} UC`} variant="outlined" />}
                    {r.semestre && <Chip size="small" label={`Semestre ${r.semestre}`} variant="outlined" />}
                    {r.prelacion && (
                      <Chip size="small" label={`Prelación: ${r.prelacion}`} color="warning" variant="outlined" />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>
            Catálogo de electivas ({electivas.length} · 4 UC cada una)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Las materias Electiva Básica, Electiva II y Electiva III (3 UC cada una) se cursan en los semestres 7,
            8 y 9 y se eligen de este catálogo.
          </Typography>
          <Grid container spacing={1}>
            {electivas.map((e) => (
              <Grid item xs={12} sm={6} md={4} key={e.codigo}>
                <Chip size="small" label={`${e.codigo} · ${e.nombre}`} variant="outlined" sx={{ width: '100%', justifyContent: 'flex-start' }} />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
