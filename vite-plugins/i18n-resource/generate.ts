import fs from 'node:fs';
import path from 'node:path';
import getOptions, { type Options } from './options';
import Template from './Template'

type NSModule = { ns: string, id: string, path: string }
type EntryFileMetaData = {
  locale: string
  modules: NSModule[]
}

export default function generateEntryFile(options: Partial<Options>) {
  const {
    entry,
    locales,
    namespaces,
  } = getOptions(options)

  const data: EntryFileMetaData[] = locales.map(locale => {
    return {
      locale,
      modules: namespaces
        .filter(ns => fs.existsSync(path.resolve(entry, locale, `${ ns }.json`)))
        .map(ns => {
          const id = `${ locale.replace(/-/g, '_') }_${ ns.replace(/[-\.]/g, '_') }`;
          const path = `./${ locale }/${ ns }.json`;
          return { id, ns, path }
        })
    }
  })

  const hmrTemplate = fs.readFileSync(path.resolve(__dirname, 'templates', 'hmr.tpl'), 'utf-8')
  fs.writeFileSync(
    path.resolve(entry, 'hmr.ts'),
    hmrTemplate
  );

  const resourceTemplate = fs.readFileSync(path.resolve(__dirname, 'templates', 'resource.tpl'), 'utf-8')
  fs.writeFileSync(
    path.resolve(entry, 'index.ts'),
    new Template(resourceTemplate).render({ data })
  );
}