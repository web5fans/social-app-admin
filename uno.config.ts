// @ts-nocheck
import presetIcons from '@unocss/preset-icons'
import fs from 'node:fs/promises'
import { defineConfig, presetAttributify, presetUno } from 'unocss'

export function createConfig({ dev = true } = {}) {
  return defineConfig({
    envMode: dev ? 'dev' : 'build',
    presets: [
      presetAttributify(),
      presetUno(),
      presetIcons({
        collections: {
          icon: name => fs.readFile(`./src/assets/icons/${ name }.svg`, 'utf-8'),
        },
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
          'width': '1em',
          'height': '1em',
        },
      }),
    ],
    rules: [
      [
        /^bg-img-(.+)$/,
        ([ , s ]) => {
          return {
            'background-image': `url('/images/${s}')`,
          }
        },
      ]
    ],
    variants: [],
    shortcuts: {},
  })
}

export default createConfig()
