import { defineConfig } from 'unocss'
import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet'

export default defineConfig({
  presets: [presetApplet(), presetRemRpx({ mode: 'rem2rpx' })],
  transformers: [transformerAttributify({ ignoreAttributes: ['block'] })],
})
