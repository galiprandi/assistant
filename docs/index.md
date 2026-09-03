---
layout: home

hero:
  name: Assistant
  text: Tu asistente personal
  tagline: Le enseñás rutinas, él las hace solo. Responde WhatsApp, manda mails, entra a sitios web. Lo controlás desde Telegram o tu IDE.
  actions:
    - theme: brand
      text: Empezar
      link: '#como-empezar'
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/galiprandi/assistant

features:
  - title: Hace las tareas repetitivas
    details: Le enseñás una rutina una vez y la repite cuando se la pedís. Revisar mensajes, mandar mails, entrar a sitios, descargar reportes.
    icon: 🔄
  - title: Controla el navegador
    details: Opera un Chromium real. Entra a WhatsApp, Gmail, LinkedIn y cualquier sitio web como lo harías vos.
    icon: 🌐
  - title: Telegram opcional
    details: Manejá tu asistente desde el celular con un bot de Telegram. O usalo desde tu IDE. Vos elegís.
    icon: 💬
  - title: 15+ modelos de IA
    details: Anthropic, OpenAI, Google, Groq, OpenRouter y más. Elegís el provider y el modelo que mejor te funcione.
    icon: 🧠
  - title: Multi-agente
    details: Cloná el repo con nombres distintos y tené varios asistentes aislados en la misma máquina. Cada uno con su navegador y su bot.
    icon: 🤖
  - title: Tu data es tuya
    details: Todo corre local. Sin nube, sin telemetry, sin backend. Tus claves y tu navegador quedan en tu máquina.
    icon: 🔒
---

## Qué es

Assistant es un agente personal que aprende tus rutinas y las ejecuta solo. Le mostrás una tarea una vez (responder WhatsApp, mandar un mail, entrar a un sitio y descargar algo) y la próxima vez le decís "hacé lo de siempre" y lo hace.

No es un chatbot. Es un agente real que controla un navegador, entra a tus apps, lee y responde mensajes, y hace el trabajo repetitivo por vos.

## Qué necesitás

- **Node.js 22+** — [descargalo acá](https://nodejs.org/)
- **Un IDE conversacional** — alguno que pueda correr comandos y leer archivos. Sugerimos:
  - [Claude Code](https://claude.com/product/claude-code) (Anthropic)
  - [Codex](https://openai.com/codex) (OpenAI)
  - [OpenRouter](https://openrouter.ai/) (multi-provider, modelos gratis disponibles)
- **Una API key** — del provider que elijas (Anthropic, OpenAI, Google, etc.)
- **Telegram** (opcional) — solo si querés controlarlo desde el celular

## Cómo empezar

### 1. Fork este repo

Andá a [github.com/galiprandi/assistant](https://github.com/galiprandi/assistant) y clickeá **Fork** arriba a la derecha.

### 2. Cloná e inicializá

Copiá y pegá esto en tu terminal, cambiando `<tu-usuario>` por tu usuario de GitHub y `mi-asistente` por el nombre que quieras:

```bash
git clone --recurse-submodules git@github.com:<tu-usuario>/assistant.git mi-asistente
cd mi-asistente
./Assistant init
```

`./Assistant init` te va a pedir:

- **Provider** — qué provider de IA vas a usar (anthropic, openai, google, etc.)
- **Modelo** — qué modelo (ej: `claude-sonnet-4-5-20250929`)
- **API key** — se guarda en `.env` (nunca se commitea a git)

### 3. Lanzalo

```bash
./Assistant
```

Se abre Pi (el motor del agente) con tu configuración. Ya podés hablarle y pedirle cosas desde el IDE.

### 4. Conectalo a Telegram (opcional)

Si querés controlarlo desde el celular:

1. Abrí [@BotFather](https://t.me/BotFather) en Telegram
2. Mandá `/newbot`, elegí nombre y username
3. Copiá el token que te da
4. En la terminal donde corre `./Assistant`, escribí:

```
/pigram-setup
```

5. Pegá el token del bot
6. Abrí tu bot en Telegram y mandá `/start`

Listo. Ahora le escribís a tu bot desde el celular y el asistente responde.

## Qué puede hacer

Algunos ejemplos de lo que le podés pedir:

- "Revisá WhatsApp y decime qué hay nuevo"
- "Respondé a Juan en WhatsApp diciendo X"
- "Mandá un mail a Y con el reporte de Z"
- "Entrá a sitio X y descargá el reporte mensual"
- "Revisá LinkedIn y decime si hay mensajes nuevos"
- "Hacé lo de siempre" → repite la última rutina que le enseñaste

Le enseñás una rutina mostrándole los pasos. La próxima vez, se la pedís y la hace solo.

## Comandos

```bash
./Assistant init     # Configurar provider, modelo y API key
./Assistant update   # Actualizar el script, las skills y pigram
./Assistant          # Lanzar el asistente
```

## Tu data es tuya

- `.env` — tu API key, nunca se commitea a git
- `AGENTS.md` — tu configuración personal, nunca se commitea
- `.browser-profile/` — sesiones del navegador, local
- `.pi/` — configuración y sesiones del agente, local

Sin nube. Sin telemetry. Sin backend. Todo en tu máquina.

## Hecho con

- [Pi](https://pi.dev) — motor del agente
- [Pigram](https://github.com/galiprandi/pigram) — bridge de Telegram
- [Playwright](https://playwright.dev) — automatización del navegador
