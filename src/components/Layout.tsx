import { Fragment, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ChecklistIcon from '@mui/icons-material/Checklist'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const DRAWER_W = 240
const DRAWER_W_MINI = 76

const navItems = [
  { to: '/', label: 'Inicio', icon: <HomeIcon />, end: true },
  { to: '/pensum', label: 'Pensum', icon: <MenuBookIcon /> },
  { to: '/prelaciones', label: 'Prelaciones', icon: <AccountTreeIcon /> },
  { to: '/trabajo-de-grado', label: 'Trabajo de Grado', icon: <AssignmentIcon /> },
  { to: '/requisitos', label: 'Requisitos de Grado', icon: <ChecklistIcon /> },
]

const STORAGE_KEY = 'uneg-utils-sidebar-collapsed'

function useCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  )
  const toggle = () => {
    setCollapsed((c) => {
      localStorage.setItem(STORAGE_KEY, c ? '0' : '1')
      return !c
    })
  }
  return [collapsed, toggle] as const
}

export default function Layout() {
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, toggleCollapsed] = useCollapsed()

  const drawerWidth = collapsed ? DRAWER_W_MINI : DRAWER_W

  const drawerContent = (mini: boolean) => (
    <Box>
      <Toolbar
        sx={{
          gap: 1,
          justifyContent: mini ? 'center' : 'flex-start',
          px: mini ? 0 : 2,
        }}
      >
        <Box
          component="img"
          src="/logo-uneg.png"
          alt="Logo UNEG"
          sx={{ height: 40, width: 40 }}
        />
        {!mini && (
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              UNEG Utils
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Estatus estudiantil
            </Typography>
          </Box>
        )}
      </Toolbar>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const link = (
            <NavLink to={item.to} end={item.end} style={{ textDecoration: 'none', color: 'inherit' }}>
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    justifyContent: mini ? 'center' : 'flex-start',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 2 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!mini && <ListItemText primary={item.label} />}
                </ListItemButton>
              )}
            </NavLink>
          )
          return mini ? (
            <Tooltip key={item.to} title={item.label} placement="right">
              {link}
            </Tooltip>
          ) : (
            <Fragment key={item.to}>{link}</Fragment>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={1} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleCollapsed}
            sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 1 }}
            aria-label={collapsed ? 'Expandir menú' : 'Compactar menú'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/logo-uneg.png"
            alt="Logo UNEG"
            sx={{ height: 36, width: 36, bgcolor: 'white', borderRadius: 1 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              UNEG Utils
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.1, opacity: 0.85 }}
            >
              Portal auxiliar · Ingeniería en Informática
            </Typography>
          </Box>
          <Tooltip title="Datos transcritos del Plan de Estudios (Plan 5, 20/06/2018) y del flujo de la CTG">
            <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.9 }}>
              Plan 5 · 178 UC · UNEG
            </Typography>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_W },
          }}
        >
          {drawerContent(false)}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              overflowX: 'hidden',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent(collapsed)}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: { xs: 7, md: 8 } }}>
        <Outlet />
        <Box
          component="footer"
          sx={{
            mt: 5,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Aviso: esta es una herramienta independiente y no oficial. La información mostrada se basa en
            documentos de carácter público de la UNEG (plan de estudios, prelaciones y flujo de Trabajo de Grado).
            Su uso y las decisiones derivadas de ella corresponden a la decisión personal de cada estudiante.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
