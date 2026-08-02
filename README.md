# UNEG Utils · Estatus Estudiantil

Es una herramienta para la visualizacion de estatus academico en la  **UNEG** (Universidad Nacional Experimental de Guayana). Te ayuda a llevar el registro de tu avance en la carrera: materias aprobadas, notas, promedios, prelaciones, requisitos de grado y el flujo de Trabajo de Grado.

> **Importante:** esta es una herramienta **independiente y no oficial**. La información mostrada se basa en documentos de carácter público de la UNEG (plan de estudios, prelaciones y flujo de Trabajo de Grado). Su uso y las decisiones derivadas de ella corresponden a la decisión personal de cada estudiante. No se recopila informacion de ningun tipo. Los usuarios son dueños de su informacion generada y exportada en archivos `.Json` procesados por la pagina para la visualizacion del contenido.

---

## Como funciona?

### Primer Ingreso

Al abrir la página por primera vez aparece una ventana de bienvenida. Ahí puedes elegir:

- **Escribir tu nombre** y presionar **"Empezar"**: así la página te identifica y tu nombre aparece en los títulos (por ejemplo, "Estatus de María").
- **"Importar progreso"**: si ya usaste la herramienta antes en otro equipo y guardaste tu avance en un archivo, elige aquí ese archivo para recuperar tus materias, notas y requisitos.
- **"Entrar sin nombre"**: si solo quieres explorar sin registrar tu identidad.

Si no tienes nada que recuperar, simplemente escribe tu nombre y listo.

### Uso

- **Marca tus materias aprobadas o en curso** en la sección **Pensum**: cada materia tiene botones para marcarla como aprobada (✓) o en curso (⏱).
- **Registra tus notas**: cuando una materia está aprobada, aparece un campo de "Nota" para escribir tu calificación (de 0 a 20). Con eso la página calcula tus promedios automáticamente.
- **Revisa tu avance** en la sección **Inicio**: el porcentaje de la carrera que llevas, tus promedios por semestre y el promedio general, las materias que puedes inscribir ahora, y el estado de tus requisitos de grado.
- **Consulta las prelaciones** (qué materias puedes cursar antes de otras) en el mapa de **Prelaciones**, pasando el cursor sobre cada materia.
- **Sigue el flujo de Trabajo de Grado** y **marca los requisitos** que ya cumpliste.

### Guardar y recuperar tu progreso

Tu avance se guarda automáticamente en el navegador que uses: si cierras la página y vuelves, todo sigue ahí.

- **Exportar**: en la sección **Pensum**, el botón **"Exportar"** descarga un archivo con todo tu progreso. Guárdalo en un lugar seguro: es tu respaldo y te permite pasar tu avance a otro equipo.
- **Importar**: usa el botón **"Importar"** (en Pensum o en la ventana de bienvenida) y elige un archivo exportado antes. Al importar, la página te avisa con un resumen de lo que contiene antes de reemplazar tu progreso actual.
- **Reiniciar**: el botón **"Reiniciar"** en Pensum borra todo (materias, notas y requisitos). La página te pide confirmación antes de hacerlo, porque no se puede deshacer.

### Salir de la sesión

El botón **Salir** (flecha en la esquina superior derecha) te devuelve a la ventana de bienvenida. No pierdes nada: tu progreso queda guardado en el navegador y puedes volver a entrar cuando quieras. Si escribes otro nombre, sigues viendo el mismo avance.

---

## Secciones de la página

| Sección | Qué encuentras |
| --- | --- |
| **Inicio** | Resumen general: porcentaje de avance, UC aprobadas, promedio general ponderado, semestre actual, gráfico de UC por semestre, materias disponibles para inscribir (ordenadas por semestre), promedios por semestre, materias en curso y requisitos de grado. |
| **Pensum** | Las 57 materias del plan organizadas por semestre. Marca estados, registra notas, busca por nombre o código, filtra por estado y exporta/importa tu progreso. |
| **Prelaciones** | Mapa de prelaciones del plan: qué materias dependen de cuáles. |
| **Trabajo de Grado** | Flujo de las fases del Trabajo de Grado según la CTG, con plazos clave y nota mínima requerida. |
| **Requisitos de Grado** | Lista de requisitos para optar al título, para marcar los cumplidos. |

---

## Datos incluidos

- Carrera: **Ingeniería en Informática** · Plan 5 (20/06/2018) · 178 UC · 9 semestres.
- **57 materias** del pensum con sus UC, semestre y prelaciones.
- **Materias electivas** (todas las ofertadas como opciones).
- **Requisitos de grado** y **fases del Trabajo de Grado** según el flujo de la CTG.

Estos datos son una transcripción manual de documentos públicos; si detectas algún error, verifica siempre contra las fuentes oficiales.

---





### Stack

Vite 6 · React 18 · TypeScript · Material UI (MUI) v5 · React Router v6 · Zustand (persistencia) · Recharts (gráficos).

---

## Estructura del proyecto

```
uneg-utils/
├── index.html                  # HTML base, favicon y metadatos
├── public/                     # Assets estáticos (logo, favicons)
├── src/
│   ├── main.tsx                # Punto de entrada (tema + router)
│   ├── App.tsx                 # Rutas de la aplicación
│   ├── theme.ts                # Tema de Material UI 
│   ├── types.ts                # Tipos compartidos (Subject, Status, etc.)
│   ├── data/                   # Datos del plan de estudios
│   │   ├── pensum.ts           # 57 materias, UC, semestres, prelaciones
│   │   ├── electivas.ts        # Materias electivas
│   │   ├── requisitos.ts       # Requisitos de grado
│   │   └── trabajoDeGrado.ts   # Fases del TEG, plazos y nota mínima
│   ├── store/
│   │   └── progressStore.ts    # Estado global (materias, notas, nombre),
│   │                           # persistido en localStorage
│   ├── utils/
│   │   ├── pensumLogic.ts      # Cálculo de avance, prelaciones y promedios
│   │   ├── exportImport.ts     # Exportación e importación de progreso (JSON)
│   │   └── modalBackdrop.ts    # Estilo compartido de fondo difuminado
│   ├── components/             # Componentes reutilizables
│   │   ├── Layout.tsx          # Barra superior, menú lateral y pie de página
│   │   ├── OnboardingModal.tsx # Ventana de bienvenida / perfil
│   │   ├── ConfirmDialog.tsx   # Ventanas de confirmación (reiniciar, salir)
│   │   ├── SubjectCard.tsx     # Tarjeta de materia (estados y nota)
│   │   ├── PrelacionesGraph.tsx# Mapa de prelaciones
│   │   └── ...                 # Logo, medidor, chips de estado, etc.
│   └── pages/                  # Vistas: Inicio, Pensum, Prelaciones,
│                               # Trabajo de Grado y Requisitos
└── package.json
```

### Cómo funciona por dentro (resumen)

- **Estado y persistencia**: toda tu información (materias, notas, requisitos y nombre) vive en un único estado global (`progressStore`) que se guarda automáticamente en el navegador con la clave `uneg-utils-progress` (versión 1).
- **Cálculos**: `pensumLogic.ts` calcula el avance en UC, las materias disponibles (prelaciones cumplidas y sin cursar), el semestre actual y los **promedios ponderados** (cada nota pesa según las UC de su materia), por semestre y general.
- **Export/Import**: `exportImport.ts` arma el archivo JSON de respaldo (`uneg-utils-progreso-AAAAMMDD.json`) con metadatos (`app`, `version`, `plan`, fecha) y valida cualquier archivo antes de importarlo, para no corromper tu progreso con un archivo incorrecto.
- **Interfaz**: Material UI con el color institucional UNEG (`#2020B0`), menú lateral colapsable, vista móvil con menú deslizable y fondos difuminados detrás de las ventanas emergentes.

---



## Disclaimer

Esta es una herramienta **independiente y no oficial**. La información mostrada se basa en documentos de carácter público de la UNEG (plan de estudios, prelaciones y flujo de Trabajo de Grado). Su uso y las decisiones derivadas de ella corresponden a la decisión personal de cada estudiante.
