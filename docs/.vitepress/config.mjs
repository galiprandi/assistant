import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Assistant',
  description: 'Your personal assistant that does the repetitive tasks for you.',
  lang: 'en',
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
