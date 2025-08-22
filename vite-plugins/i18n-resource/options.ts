import fg from 'fast-glob';
import path from 'node:path';

export type Options = {
  entry: string
  locales: string[]
  namespaces: string[]
}

export default function getOptions(options: Partial<Options> = {}): Options {
  const {
    entry = 'locales',
    locales = getLocales(entry),
    namespaces = getNamespaces(entry)
  } = options

  return { entry, locales, namespaces }
}

export function getLocales(root: string) {
  return fg.sync(
    "*",
    {
      cwd: root,
      onlyDirectories: true
    }
  )
}

export function getNamespaces(root: string) {
  return Array.from(
    new Set(
      fg.sync(
        '*/*.json',
        {
          cwd: root,
          onlyFiles: true
        }
      ).map(file => path.basename(file, '.json'))
    )
  )
}