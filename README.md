# Gates Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> [Vue Gates](https://github.com/williamcruzme/vue-gates) based module for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

**Note**: This version of the module is compatible with [Nuxt 3 and Nuxt Bridge](https://v3.nuxtjs.org/).

## Setup

1. Add `nuxt-gates` dependency to your project

```bash
yarn add --dev nuxt-gates # or npm install --save-dev nuxt-gates
```

2. Add `nuxt-gates` to the `modules` section of `nuxt.config.js`

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    // Simple usage
    'nuxt-gates',

    // With options
    ['nuxt-gates', { /* module options */ }]
  ]
})
```

### Using top level options

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    'nuxt-gates'
  ],
  gates: {
    /* module options */
  }
})
```

## Options

### superRole (optional)

- Default: `null`

Super role avoids all role and permission validations.

### name (optional)

- persistent: `false`

If the value is `true` then it will save the roles and permissions in `localStorage`, when the application reloads the values will be set automatically.

## Usage

- In Composition API, you can access the `Gates` methods by using `const { ... } = useGates()`
  or `const { $gates } = useNuxtApp()`.

- In Options API, you can access the `Gates` methods by using `this.$gates`.

[More informations on Vue Gates documentation](https://williamcruzme.github.io/vue-gates)

### Set roles and permissions

This should be the first step. When you log in or start the application, you must set the roles and permissions:

```js
const { setRoles, setPermissions, getRoles, getPermissions } = useGates()

setRoles(['writer']);
setPermissions(['posts.*', 'images.create']);

getRoles(); // ['writer']
getPermissions(); // ['posts.*', 'images.create']

```

### Directives as functions

You can also use the custom directives as functions.

```js
const { 
  hasRole,
  unlessRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  unlessPermission,
  hasAnyPermission,
  hasAllPermissions
} = useGates()

hasRole('admin'); // false
unlessRole('admin'); // true
hasAnyRole('admin|writer'); // true
hasAllRoles('admin|writer'); // false

hasPermission('posts.create'); // true
unlessPermission('posts.create'); // false
hasAnyPermission('posts.create|images'); // true
hasAllPermissions('posts.create|images.create'); // true
```

### Named middleware

You can create named middleware by creating a file inside the `middleware/` directory, the file name will be the middleware name:

`middleware/admin.js`:

```js
export default defineNuxtRouteMiddleware() {
  const { hasRole } = useGates()

  // If the user is not an admin
  if (!hasRole('admin')) {
    return navigateTo('/login')
  }
}
```

`pages/secret.vue`:

```js
<template>
  <h1>Secret page</h1>
</template>

<script setup>
definePageMeta({
  middleware: ["admin"]
})
</script>
```

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.

## License

[MIT License](./LICENSE)

Copyright (c) João Pedro Antunes Silva

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-gates/latest.svg

[npm-version-href]: https://npmjs.com/package/nuxt-gates

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-gates.svg

[npm-downloads-href]: https://npmjs.com/package/nuxt-gates

[github-actions-ci-src]: https://github.com/JoaoPedroAS51/nuxt-gates/workflows/ci/badge.svg

[github-actions-ci-href]: https://github.com/JoaoPedroAS51/nuxt-gates/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/JoaoPedroAS51/nuxt-gates.svg

[codecov-href]: https://codecov.io/gh/JoaoPedroAS51/nuxt-gates

[license-src]: https://img.shields.io/npm/l/nuxt-gates.svg

[license-href]: https://npmjs.com/package/nuxt-gates
