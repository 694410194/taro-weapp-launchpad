# Taro WeApp Launchpad（2025）

深圳小王子（xiaowz）出品 · 面向商业化交付的微信小程序工程化底座。

这个仓库只解决一件事：**用最少的“可选项”，给你一个长期可维护的微信小程序（weapp）项目骨架**。不塞业务代码，开箱即用，适合个人开发者/小团队直接拿去做商业项目。

[English README](./README.en.md)

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D18.18.0-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-10-blue)

> 可选：把下面 CI Badge 的 `OWNER/REPO` 改成你的仓库地址后再启用
>
> <!-- ![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg) -->

## 你将获得什么

- **只适配微信小程序（weapp）**：刻意收敛，不做多端兼容，减少技术债
- **工程化开箱即用**：ESLint / Prettier / Stylelint + Husky / Commitlint / lint-staged
- **基础设施到位**：`@tanstack/react-query`（服务端状态）+ `zustand`（本地状态）+ `zod`（数据校验）
- **默认强约束**：TypeScript `strict`、UnoCSS 原子化样式（不引入 Sass，更易维护与复用）
- **CI 就绪**：GitHub Actions（lint / typecheck / build）、Issue/PR 模板、Dependabot
- **商业可用**：MIT License（可闭源商用，保留版权声明即可）

## 技术栈

- 框架：`Taro 4.1.x`（Webpack5）+ `React 18` + `TypeScript`
- 样式：`UnoCSS`（`unocss-applet` 适配小程序）
- 数据层：`@tanstack/react-query`、`zustand`、`zod`
- 规范：ESLint / Prettier / Stylelint、Conventional Commits

## 目录结构

```text
.
├─ config/                 # Taro 构建配置
├─ scripts/                # 自动化脚本（如 miniprogram-ci 上传）
├─ src/
│  ├─ shared/              # 纯工具/通用能力（无 Taro 依赖）
│  ├─ pages/               # 页面（示例：index）
│  ├─ services/            # 基础设施（request/storage/logger/ui）
│  ├─ app.config.ts        # 小程序全局配置
│  └─ app.tsx              # 应用入口（Provider 等）
├─ types/                  # 全局类型声明
├─ unocss.config.ts        # UnoCSS 配置（含小程序适配）
└─ project.config.json     # 微信开发者工具项目配置（dist/）
```

## 快速开始

### 环境要求

- Node.js `>= 18.18`
- pnpm `>= 10`
- 微信开发者工具（导入项目时指向 `dist/`）

### 安装与运行

```bash
pnpm i
pnpm dev:weapp
```

然后打开微信开发者工具，导入项目并选择 `dist/` 目录即可预览。

## 常用命令

- 开发/构建：`pnpm dev:weapp`、`pnpm build:weapp`
- 质量检查：`pnpm check`（lint + stylelint + typecheck + build）
- 格式化：`pnpm format`、`pnpm format:check`
- 清理：`pnpm clean`
- 上传（可选）：`pnpm upload:weapp`（默认上传 `dist/`，需要配置 `MINIPROGRAM_PRIVATE_KEY_PATH` 等环境变量）
- 构建+上传（可选）：`pnpm deploy:weapp`

## 配置与约定

- **小程序 AppID**
  - 开发阶段：默认 `project.config.json` 使用 `touristappid`
  - 多环境：建议通过环境变量 `TARO_APP_ID` 管理（需要你在 CI/本地注入）
- **路径别名**：默认 `@/*` 指向 `src/*`（见 `tsconfig.json`）
- **UnoCSS**：入口已引入 `uno.css`，配置见 `unocss.config.ts`（小程序下支持 `rem <=> rpx` 转换）
- **小程序 CI 上传（可选）**：`scripts/upload-weapp.mjs` 基于 `miniprogram-ci`，默认上传 `dist/`（可用 `MINIPROGRAM_PROJECT_PATH` 覆盖）

## 代码组织建议（避免屎山的关键）

- **职责单一**：
  - `src/shared/`：纯函数/工具/通用能力（不依赖 Taro，方便复用与测试）
  - `src/services/`：基础设施（请求、存储、日志、UI 交互封装）
  - `src/pages/`：页面与页面级逻辑（别把业务全写在一个页面里）
- **状态分工**：
  - 服务端数据：优先 `react-query`（缓存/重试/失效）
  - UI/交互状态：小而局部用 `zustand`
- **接口强类型**：推荐用 `zod` 做运行时校验，并把后端 DTO/错误码收口在 `src/services/`

## 常见问题

- `husky .git can't be found`
  - 这是因为当前目录还没初始化 Git；执行 `git init` 后再 `pnpm i` 即可启用 hooks。
- `pnpm install` 提示 `approve-builds`
  - 属于 pnpm 的安全机制；本模板在 `package.json` 已配置允许的构建依赖白名单。

## 贡献

请阅读 `CONTRIBUTING.md`，欢迎提交 PR / Issue。

## 安全

请阅读 `SECURITY.md`，建议使用 GitHub Security Advisories 私密上报漏洞。

## License

MIT
