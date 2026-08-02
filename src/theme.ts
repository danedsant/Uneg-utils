import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2020B0' },
    secondary: { main: '#00838F' },
    background: { default: '#F4F6FA' },
  },
  shape: { borderRadius: 10 },
  typography: {
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(16, 16, 144, 0.12)',
          height: '100%',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: { fontWeight: 700 },
      },
    },
  },
})
