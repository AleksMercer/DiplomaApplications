<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow p-4 flex gap-4 justify-center">
      <router-link to="/load" class="text-blue-600 hover:underline"
        >Load</router-link
      >
      <router-link to="/filter" class="text-blue-600 hover:underline"
        >Filter</router-link
      >
      <router-link to="/form" class="text-blue-600 hover:underline"
        >Form</router-link
      >
    </nav>
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>