import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { type Options } from './options'
import generateEntryFile from './generate'

export default function i18nResource(options: Partial<Options> = {}): Plugin {

  options.entry = path.resolve(process.cwd(), options.entry || 'locales')

  return {
    name: 'i18n-resource',
    enforce: 'pre',

    configureServer({ watcher }) {
      watcher.on("all", async (eventName, path) => {
        if (eventName === 'change') return;
        // root/*
        // root/*/*.json
        new RegExp(`^${options.entry}/.+?(/[^/]+?.json)?$`).test(path) && generateEntryFile(options)
      })
    },
    buildStart() {
      generateEntryFile(options)
    },

    // HMR
    handleHotUpdate({ file, server }) {
      if (
        process.env.NODE_ENV === 'development' &&
        new RegExp(`^${options.entry}/.+/(.+\\.json)$`).test(file)
      ) {
        server.ws.send({
          type: "custom",
          event: "i18n-resource-update",
          data: {
            file,
            content: fs.readFileSync(file, "utf-8"),
          },
        })
        return []
      }
    }

  }
}