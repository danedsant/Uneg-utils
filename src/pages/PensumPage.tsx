import { useMemo, useRef, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { subjects } from '../data/pensum'
import { useProgressStore } from '../store/progressStore'
import { prelacionesMet, promedioPonderado, statusOf } from '../utils/pensumLogic'
import { buildExport, validateExport } from '../utils/exportImport'
import type { DisplayStatus, Subject } from '../types'
import SubjectCard from '../components/SubjectCard'

type StatusFilter = 'todos' | DisplayStatus

export default function PensumPage() {
  const statuses = useProgressStore((s) => s.statuses)
  const grades = useProgressStore((s) => s.grades)
  const requirements = useProgressStore((s) => s.requirements)
  const nombre = useProgressStore((s) => s.nombre)
  const setStatus = useProgressStore((s) => s.setStatus)
  const setGrade = useProgressStore((s) => s.setGrade)
  const importState = useProgressStore((s) => s.importState)
  const resetAll = useProgressStore((s) => s.resetAll)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('todos')
  const [importError, setImportError] = useState(false)
  const [importOk, setImportOk] = useState(false)

  const displayStatusOf = (s: Subject): DisplayStatus => {
    const st = statusOf(s, statuses)
    if (st === 'approved') return 'approved'
    if (st === 'inProgress') return 'inProgress'
    if (prelacionesMet(s, statuses)) return 'available'
    return 'pending'
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subjects.filter((s) => {
      if (q && !s.nombre.toLowerCase().includes(q) && !s.codigo.toLowerCase().includes(q)) return false
      if (filter !== 'todos' && displayStatusOf(s) !== filter) return false
      return true
    })
  }, [query, filter, statuses]) // eslint-disable-line react-hooks/exhaustive-deps

  const bySemester = useMemo(() => {
    const map = new Map<number, Subject[]>()
    for (const s of filtered) {
      const arr = map.get(s.semestre) ?? []
      arr.push(s)
      map.set(s.semestre, arr)
    }
    return map
  }, [filtered])

  const handleReset = () => {
    if (window.confirm('¿Reiniciar todo tu progreso (materias, notas y requisitos)? Esta acción no se puede deshacer.')) {
      resetAll()
    }
  }

  const handleExport = () => {
    const payload = buildExport(nombre, statuses, grades, requirements)
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uneg-utils-progreso-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = validateExport(JSON.parse(String(reader.result)))
        if (!parsed) {
          setImportError(true)
          setImportOk(false)
          return
        }
        const approvedCount = Object.values(parsed.statuses).filter((s) => s === 'approved').length
        const gradeCount = Object.keys(parsed.grades).length
        const reqCount = Object.values(parsed.requirements).filter(Boolean).length
        const who = parsed.nombre ? `"${parsed.nombre}"` : 'sin nombre'
        const ok = window.confirm(
          `Se reemplazará tu progreso actual por el de ${who}.\n\n` +
            `Materias aprobadas: ${approvedCount}\nNotas registradas: ${gradeCount}\nRequisitos cumplidos: ${reqCount}`
        )
        if (ok) {
          importState(parsed)
          setImportOk(true)
          setImportError(false)
        }
      } catch {
        setImportError(true)
        setImportOk(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Pensum
          </Typography>
          <Typography color="text.secondary">
            Ingeniería en Informática · Plan 5 · 9 semestres · 178 UC
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleExport}>
            Exportar
          </Button>
          <Button startIcon={<FileUploadIcon />} variant="outlined" onClick={() => fileInputRef.current?.click()}>
            Importar
          </Button>
          <Button startIcon={<RestartAltIcon />} onClick={handleReset} color="error" variant="outlined">
            Reiniciar
          </Button>
        </Stack>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      {importError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setImportError(false)}>
          El archivo no es un JSON válido de UNEG Utils. No se importó nada.
        </Alert>
      )}
      {importOk && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setImportOk(false)}>
          Progreso importado correctamente.
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Buscar por nombre o código…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel id="status-filter-label">Estado</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Estado"
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusFilter)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="available">Disponibles</MenuItem>
            <MenuItem value="inProgress">Cursando</MenuItem>
            <MenuItem value="approved">Aprobadas</MenuItem>
            <MenuItem value="pending">Pendientes</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {Array.from(bySemester.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([sem, list]) => {
          const semTotal = list.reduce((acc, s) => acc + s.uc, 0)
          const semApproved = list.reduce((acc, s) => acc + (statuses[s.codigo] === 'approved' ? s.uc : 0), 0)
          const prom = promedioPonderado(list, statuses, grades)
          return (
            <Accordion key={sem} defaultExpanded disableGutters sx={{ mb: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 2 }}>
                  <Typography sx={{ width: 130, flexShrink: 0 }} fontWeight={600}>
                    Semestre {sem}
                  </Typography>
                  <Chip size="small" label={`${semApproved} / ${semTotal} UC`} variant="outlined" />
                  {prom !== null && (
                    <Chip size="small" label={`Prom ${prom.toFixed(1)}`} color="secondary" variant="outlined" />
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={semTotal ? (semApproved / semTotal) * 100 : 0}
                    />
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {list.map((s) => (
                    <Grid item xs={12} sm={6} md={4} key={s.codigo}>
                      <SubjectCard
                        subject={s}
                        statuses={statuses}
                        grades={grades}
                        displayStatus={displayStatusOf(s)}
                        onSetStatus={setStatus}
                        onSetGrade={setGrade}
                      />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )
        })}

      {filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4 }} align="center">
          No hay materias que coincidan con la búsqueda o el filtro seleccionado.
        </Typography>
      )}
    </Box>
  )
}
