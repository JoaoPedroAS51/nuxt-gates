import type { DirectiveBinding } from 'vue'
import { useGates } from '../runtime/composables'
import { startCase, isEmpty } from './strings'

type Binding = DirectiveBinding & { name: string }

export const parseCondition = (binding: Binding) => {
  let suffix = binding.name === 'can' ? 'permission' : binding.name
  let arg = 'has'

  if (binding.arg) {
    if (binding.arg === 'unless') {
      arg = 'unless'
    } else if (binding.arg !== 'has') {
      arg += startCase(binding.arg)
    }
  }

  // Convert to plural if is needed
  if (arg === 'hasAll') {
    suffix += 's'
  }

  return `${arg}${startCase(suffix)}`
}

export const isConditionPassed = (gates: ReturnType<typeof useGates>, condition: string | ((binding: DirectiveBinding) => boolean)) => (el: Element, binding: Binding) => {
  if (!binding.value) {
    console.error('You must specify a value in the directive.')
    return
  }

  // Get condition to validate
  let isValid = false
  if (typeof condition === 'function') {
    isValid = condition(binding)
  } else {
    binding.name = condition // Fix missing name property
    isValid = gates[parseCondition(binding)](binding.value)
  }

  if (!isValid) {
    if (isEmpty(binding.modifiers)) {
      // Remove DOM Element
      el.parentNode?.removeChild(el)
    } else {
      // Set attributes to DOM element
      Object.assign(el, binding.modifiers)
    }
  }
}
