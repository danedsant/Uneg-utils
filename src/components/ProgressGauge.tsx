import { Box, CircularProgress, Typography } from '@mui/material'

interface Props {
  value: number
  size?: number
  caption?: string
}

export default function ProgressGauge({ value, size = 150, caption }: Props) {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={Math.min(value, 100)} size={size} thickness={5} />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" color="primary">
            {Math.round(value)}%
          </Typography>
        </Box>
      </Box>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          {caption}
        </Typography>
      )}
    </Box>
  )
}
