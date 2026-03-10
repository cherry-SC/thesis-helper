<template>
  <div class="academic-card p-6">
    <slot></slot>
  </div>
</template>

<style scoped>
.academic-card {
  @apply bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.academic-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
</style>
