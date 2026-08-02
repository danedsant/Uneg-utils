import { NavLink } from 'react-router-dom'
import { Box } from '@mui/material'

interface Props {
  size?: number
  link?: boolean
}

export default function Logo({ size = 40, link = false }: Props) {
  const img = (
    <Box
      component="img"
      src="/logo-uneg.png"
      alt="UNEG Utils"
      draggable={false}
      className="uneg-logo-img"
      sx={{
        display: 'block',
        width: size,
        height: size,
        bgcolor: 'white',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        userSelect: 'none',
        transition: 'box-shadow 0.2s ease',
      }}
    />
  )

  if (!link) return img

  return (
    <NavLink to="/" aria-label="Ir al inicio" style={{ textDecoration: 'none', lineHeight: 0 }}>
      <Box sx={{ '&:hover .uneg-logo-img': { boxShadow: 2 } }}>{img}</Box>
    </NavLink>
  )
}
