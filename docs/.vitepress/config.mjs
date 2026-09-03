import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Assistant',
  description: 'Tu asistente personal que hace las tareas repetitivas por vos.',
  lang: 'es-AR',
  cleanUrls: true,
  base: '/assistant/',

  themeConfig: {
    siteTitle: 'Assistant',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/galiprandi/assistant' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2026 German Aliprandi',
    },

    outline: {
      label: 'En esta página',
    },

    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente',
    },
  },
})
