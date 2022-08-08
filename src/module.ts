import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addAutoImport } from '@nuxt/kit'

export interface ModuleOptions {
  persistent: boolean
  superRole: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gates-module',
    configKey: 'gates'
  },
  defaults: {
    persistent: false,
    superRole: null
  },
  setup (options, nuxt) {
    nuxt.options.runtimeConfig.public.gates = options

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin'))

    addAutoImport({
      name: 'useGates',
      as: 'useGates',
      from: resolve(runtimeDir, 'composables')
    })
  }
})
