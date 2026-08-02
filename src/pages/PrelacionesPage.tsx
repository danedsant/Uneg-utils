import { Alert, Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { useProgressStore } from '../store/progressStore'
import PrelacionesGraph from '../components/PrelacionesGraph'

export default function PrelacionesPage() {
  const statuses = useProgressStore((s) => s.statuses)
  const setStatus = useProgressStore((s) => s.setStatus)

  const handleToggle = (codigo: string) => {
    setStatus(codigo, statuses[codigo] === 'approved' ? 'none' : 'approved')
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Prelaciones
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Mapa vertical de prerrequisitos: se lee de arriba hacia abajo, del Semestre 1 al 9. Cada flecha indica una
        materia que debe aprobarse antes de cursar la siguiente.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Haz clic sobre una materia para marcarla como aprobada (o quitarla) y observa en vivo qué materias se
        desbloquean. Usa los accesos «Sem 1…Sem 9» para saltar a un semestre. Los detalles de cada materia se
        muestran al pasar el cursor.
      </Alert>

      <Card>
        <CardHeader
          title="Mapa de prelaciones por semestre"
          subheader="Semestre 1 → 9, con las unidades de crédito de cada semestre"
        />
        <CardContent>
          <PrelacionesGraph statuses={statuses} onToggle={handleToggle} />
        </CardContent>
      </Card>
    </Box>
  )
}
