import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { match } from '../utils/strings'
import type { ModuleOptions } from '../module'

export function useGates (options: Partial<ModuleOptions> = {}) {
  const runtimeConfig = useRuntimeConfig()

  const _options = {
    ...runtimeConfig.public.gates,
    ...options
  }
  const _canPersistent = useState<boolean>('canPersistent', () => _options.persistent && process.client)
  const _roles = useState<string[]>('roles', () => [])
  const _permissions = useState<string[]>('permissions', () => [])
  const _superRole = useState<string | null>('superRole', () => _options.superRole || null)

  if (_canPersistent.value) {
    const persistentRoles = localStorage.getItem('roles')
    _roles.value = persistentRoles ? JSON.parse(persistentRoles) : []

    const persistentPermissions = localStorage.getItem('permissions')
    _permissions.value = persistentPermissions ? JSON.parse(persistentPermissions) : []
  }

  /*
  |-------------------------------------------------------------------------
  | Setters
  |-------------------------------------------------------------------------
  |
  | These functions controls the "permissions" and "roles" provided
  | by Vue Gates, or from a custom array.
  |
  */

  const setRoles = (roles: string[]): void => {
    _roles.value = roles
    if (_canPersistent.value) {
      localStorage.setItem('roles', JSON.stringify(roles))
    }
  }

  const setPermissions = (permissions: string[]): void => {
    _permissions.value = permissions
    if (_canPersistent.value) {
      localStorage.setItem('permissions', JSON.stringify(permissions))
    }
  }

  /*
  |-------------------------------------------------------------------------
  | Getters
  |-------------------------------------------------------------------------
  |
  | These functions return the "permissions" and "roles" stored.
  | This is useful when you want list all data.
  |
  */

  const getRoles = (): string[] => _roles.value

  const getPermissions = (): string[] => _permissions.value

  const isSuperUser = (): boolean => !!_superRole.value && _roles.value.includes(_superRole.value)

  /*
  |-------------------------------------------------------------------------
  | Directives
  |-------------------------------------------------------------------------
  |
  | These is a group of functions for Vue Directives.
  | This is useful when you want valid a "permission" or "role"
  | programmatically.
  |
  */

  // Roles
  const hasRole = (role: string): boolean => isSuperUser() || _roles.value.includes(role)

  const unlessRole = (role: string): boolean => !hasRole(role)

  const hasAnyRole = (values: string): boolean => {
    if (isSuperUser()) {
      return true
    }

    const roles = values.split('|')
    return roles.some(role => hasRole(role))
  }

  const hasAllRoles = (values: string): boolean => {
    if (isSuperUser()) {
      return true
    }

    const roles = values.split('|')
    return roles.every(role => hasRole(role))
  }

  // Permissions
  const hasPermission = (permission: string): boolean => isSuperUser() || !!_permissions.value.find(wildcard => match(permission, wildcard))

  const unlessPermission = (permission: string): boolean => !hasPermission(permission)

  const hasAnyPermission = (values: string): boolean => {
    if (isSuperUser()) {
      return true
    }

    const permissions = values.split('|')
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (values: string): boolean => {
    if (isSuperUser()) {
      return true
    }

    const permissions = values.split('|')
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    // Setters
    setRoles,
    setPermissions,
    // Getters
    getRoles,
    getPermissions,
    isSuperUser,
    // Directives
    hasRole,
    unlessRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    unlessPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
