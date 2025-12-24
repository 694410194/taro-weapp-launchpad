import fs from 'node:fs'
import path from 'node:path'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env: ${name}`)
  return value
}

function resolveExistingPath(p) {
  const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`)
  return abs
}

async function main() {
  const appid = process.env.TARO_APP_ID ?? process.env.MINIPROGRAM_APPID
  if (!appid) throw new Error('Missing env: TARO_APP_ID or MINIPROGRAM_APPID')

  const projectPath = resolveExistingPath(
    process.env.MINIPROGRAM_PROJECT_PATH ?? path.resolve(process.cwd(), 'dist'),
  )
  const privateKeyPath = resolveExistingPath(requireEnv('MINIPROGRAM_PRIVATE_KEY_PATH'))

  const { default: ci } = await import('miniprogram-ci')

  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath,
    privateKeyPath,
    ignores: ['node_modules/**/*'],
  })

  const version = process.env.MINIPROGRAM_VERSION ?? '0.0.0'
  const desc = process.env.MINIPROGRAM_DESC ?? 'upload by miniprogram-ci'
  const robot = process.env.MINIPROGRAM_ROBOT ? Number(process.env.MINIPROGRAM_ROBOT) : undefined

  const result = await ci.upload({
    project,
    version,
    desc,
    robot,
    setting: {
      es6: true,
      minify: true,
    },
  })

  // eslint-disable-next-line no-console
  console.log('miniprogram-ci upload success:', result)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})
