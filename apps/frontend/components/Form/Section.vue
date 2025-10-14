<template>
  <div class="px-10 py-5 prose md:flex formsection">
    <div class="w-full md:w-2/5 p-5">
      <h3>{{ $props.title }}</h3>
      <p>{{ $props.description }}</p>
      <slot name="extra" />
    </div>
    <div class="w-full md:w-3/5 bg-base-100 rounded-md p-5 shadow-md">
      <slot />
    </div>
  </div>
  <div class="divider m-0" v-if="$props.divider"></div>
</template>

<script setup lang="ts">
defineProps({
  divider: { type: Boolean, required: false, default: true },
  title: { type: String, required: false, default: "Section Title" },
  description: { type: String, required: true },
});
</script>
