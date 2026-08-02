import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { useProgressStore } from '../store/progressStore'
import { validateExport } from '../utils/exportImport'
import { blurredBackdrop } from '../utils/modalBackdrop'
import type { ImportedProgress } from '../store/progressStore'

export default function OnboardingModal() {
  const onboarded = useProgressStore((s) => s.onboarded)
  const profileOpen = useProgressStore((s) => s.profileOpen)
  const nombre = useProgressStore((s) => s.nombre)
  const setNombre = useProgressStore((s) => s.setNombre)
  const setOnboarded = useProgressStore((s) => s.setOnboarded)
  const closeProfileModal = useProgressStore((s) => s.closeProfileModal)
  const importState = useProgressStore((s) => s.importState)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState(false)

  const open = !onboarded || profileOpen
  const isFirstTime = !onboarded

  const finish = (payload?: ImportedProgress) => {
    if (payload) importState(payload)
    setOnboarded(true)
    closeProfileModal()
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
        if (ok) finish(parsed)
      } catch {
        setImportError(true)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog
      open={open}
      onClose={isFirstTime ? undefined : closeProfileModal}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown={isFirstTime}
      BackdropProps={{ sx: blurredBackdrop }}
    >
      <DialogTitle>{isFirstTime ? 'Bienvenido a UNEG Utils' : 'Tu perfil'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {isFirstTime
              ? 'Escribe tu nombre para empezar a registrar tu avance, o importa tu progreso guardado.'
              : 'Actualiza tu nombre o importa un progreso guardado.'}
          </Typography>

          {importError && (
            <Alert severity="error" onClose={() => setImportError(false)}>
              El archivo no es un JSON válido de UNEG Utils.
            </Alert>
          )}

          <TextField
            autoFocus
            label="Tu nombre"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && nombre.trim()) finish()
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        {isFirstTime && (
          <Button
            color="inherit"
            size="small"
            sx={{ mr: 'auto' }}
            onClick={() => {
              setNombre('')
              finish()
            }}
          >
            Entrar sin nombre
          </Button>
        )}
        <Button startIcon={<FileUploadIcon />} variant="outlined" onClick={() => fileInputRef.current?.click()}>
          Importar progreso
        </Button>
        <Button variant="contained" disabled={!nombre.trim()} onClick={() => finish()}>
          {isFirstTime ? 'Empezar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
