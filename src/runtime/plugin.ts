import { defineNuxtPlugin } from '#app'
import type { Directive, App } from 'vue'

import { isConditionPassed } from '../utils/validator'
import { useGates } from './composables'

export default defineNuxtPlugin((nuxtApp) => {
  const gates = useGates()

  nuxtApp.provide('gates', gates)

  const directiveOptions = (condition: string): [string, Directive] => [condition, {
    mounted: isConditionPassed(gates, condition)
  }]

  nuxtApp.vueApp.directive(...directiveOptions('role'))
  nuxtApp.vueApp.directive(...directiveOptions('permission'))
  nuxtApp.vueApp.directive(...directiveOptions('can')) // Alias for "v-permission"
  nuxtApp.vueApp.directive('role-or-permission', {
    mounted: isConditionPassed(gates, (binding) => {
      const values = binding.value.split('|')
      const role = values[0]
      const permission = values[1]

      return gates.hasRole(role) || gates.hasPermission(permission)
    })
  })
})

interface PluginInjection {
  $gates: ReturnType<typeof useGates>
}

// Nuxt Bridge & Nuxt 3
declare module '#app' {
  interface NuxtApp extends PluginInjection {
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginInjection {
  }
}

// @ts-ignore
declare module 'vue/types/vue' {
  interface Vue extends PluginInjection {
  }
}
