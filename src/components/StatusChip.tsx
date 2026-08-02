import Chip from '@mui/material/Chip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import FlagIcon from '@mui/icons-material/Flag'
import LockIcon from '@mui/icons-material/Lock'
import type { DisplayStatus } from '../types'

const config: Record<DisplayStatus, { label: string; color: 'success' | 'warning' | 'primary' | 'default'; icon: JSX.Element }> = {
  approved: { label: 'Aprobada', color: 'success', icon: <CheckCircleIcon /> },
  inProgress: { label: 'Cursando', color: 'warning', icon: <ScheduleIcon /> },
  available: { label: 'Disponible', color: 'primary', icon: <FlagIcon /> },
  pending: { label: 'Pendiente', color: 'default', icon: <LockIcon /> },
}

export default function StatusChip({ status, size }: { status: DisplayStatus; size?: 'small' | 'medium' }) {
  const { label, color, icon } = config[status]
  return <Chip size={size} label={label} color={color} icon={icon} variant="outlined" />
}
