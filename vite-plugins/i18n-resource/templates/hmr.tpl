// i18n resource HMR
import i18n from "i18next";

if (import.meta.hot) {
  import.meta.hot.on(
    "i18n-resource-update",
    async ({ file, content }: Record<string, string>) => {
      const resource = JSON.parse(content);

      const locale = file.match(/locales\/(.+?)\//)?.[1]
      const ns = file.match(/.*\/(.+)\.json/)?.[1]

      if (!locale || !ns) return

      i18n.addResourceBundle(locale, ns, resource, true, true)
      i18n.reloadResources(locale, ns)

      // trick: 令组件 rerender
      i18n.emit("languageChanged")
    }
  )
}
