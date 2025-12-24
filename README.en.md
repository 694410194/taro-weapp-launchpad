# Taro WeApp Launchpad (2025)

[中文 README](./README.md)

Made by Shenzhen Xiaowangzi (xiaowz) — a production-ready, opinionated starter for **WeChat Mini Program (weapp)** with **Taro 4 + React + TypeScript**.

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D18.18.0-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-10-blue)
[![CI](https://github.com/694410194/taro-weapp-launchpad/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/694410194/taro-weapp-launchpad/actions/workflows/ci.yml)

## Features

- WeApp-only by default (no multi-target complexity)
- Taro `4.1.x` (Webpack5), React 18, TypeScript
- UnoCSS (via `unocss-applet`) for applet-friendly atomic CSS
- TanStack Query + Zustand + Zod (infrastructure only, no business logic)
- ESLint / Prettier / Stylelint + Husky + Commitlint + lint-staged
- GitHub Actions CI + issue / PR templates + Dependabot

## Getting Started

```bash
pnpm i
pnpm dev:weapp
```

Then open **WeChat Developer Tools** and import this project, pointing to `dist/`.

## Scripts

- `pnpm dev:weapp` / `pnpm build:weapp`
- `pnpm lint` / `pnpm typecheck` / `pnpm format`
- `pnpm check` (lint + stylelint + typecheck + build)
- `pnpm upload:weapp` / `pnpm deploy:weapp` (optional, uploads `dist/` by default via `miniprogram-ci`)

## License

MIT
