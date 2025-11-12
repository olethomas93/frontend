# Atvise Operations Frontend

Modern Nuxt 3 implementation of the Atvise operations experience powered by Vue 3, Tailwind CSS and Naive UI.

## Tech stack
- [Nuxt 3](https://nuxt.com) with full SSR support
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Tailwind CSS](https://tailwindcss.com/) utility styling
- [Naive UI](https://www.naiveui.com/) component framework
- [TypeScript](https://www.typescriptlang.org/) ready

## Getting started
```bash
# install dependencies
npm install

# start a local development server on http://localhost:3000
npm run dev

# production build
npm run build

# preview the production build locally
npm run preview

# optional static generation
npm run generate
```

The project ships with Tailwind and PostCSS pre-configured. Update `tailwind.config.ts` to tailor the design system to your needs.

## Project structure
- `app.vue` — application shell with Naive UI powered sidebar and header
- `pages/` — feature views: dashboard, process editor, authentication flows
- `plugins/` — Naive UI plugin registration
- `assets/css/tailwind.css` — Tailwind entry point and base styles
- `public/` — static assets served as-is

## Environment variables
Nuxt 3 uses `.env` files. Create a `.env` file at the project root when integrating with live services.

```
NITRO_PORT=3000
NITRO_HOST=0.0.0.0
```

Extend this file with authentication and API endpoints as you wire the frontend to your backend services.
