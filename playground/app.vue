<template>
  <div>
    Nuxt module playground!

    <div>
      <button v-role="'writer'">
        Add Article
      </button>
      <button v-if="gates.hasRole('reader')">
        Read
      </button>
    </div>
  </div>
</template>

<script setup>
const { $gates } = useNuxtApp()
const gates = useGates()

gates.setRoles(['writer'])
gates.setPermissions(['posts.*', 'images.create'])

console.log(gates.getRoles()) // ['writer']
console.log($gates.getRoles()) // ['writer']
console.log(gates.getPermissions()) // ['posts.*', 'images.create']
console.log($gates.getPermissions()) // ['posts.*', 'images.create']
</script>
