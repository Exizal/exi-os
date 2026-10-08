# EXI OS frontend

A browser-only showcase of the EXI OS interface: glass rendering, compact navigation, project views, notes, tasks and theme controls.

This project uses fictional sample content. Edits stay in this browser's local storage. It contains no Supabase client, database schema, native backend, account sign-in, service sessions, private configuration or security audit documents. Website playback and native desktop features belong to the separate Windows application and are not simulated here.

```powershell
npm ci
npm run dev
```

`npm run build` produces static files under `dist`. Windows is not required for this frontend.

## Structure

- `src/pages/` — dashboard, projects, notes and Theme Studio.
- `src/components/` — shared panels and navigation.
- `src/state.ts` — fictional sample data and local browser persistence.
- `src/GlassBackdrop.tsx` and `src/glass-scene.ts` — wallpaper-only glass composition.
- `public/assets/` — original SVG backgrounds and the EXI mark.
- `vendor/liquidglass/` — LiquidGlass and its documented local rendering changes.

LiquidGlass credits and licensing information are preserved in [vendor provenance](vendor/liquidglass/PROVENANCE.md). This repository is the frontend showcase, not the full desktop application.
