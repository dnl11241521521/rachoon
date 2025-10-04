<template>
  <div :class="`px-10 py-3 flex gap-5 justify-between items-center prose ${$props.divider ? 'border-b border-base-300' : ''}`">
    <h3 class="flex gap-3 items-center m-0 p-0">
      <FaIcon :icon="`fa-solid ${$props.icon}`" />
      <span>{{ $props.title }}</span>
      <span class="text-xs mt-1 opacity-50">{{ $props.subtitle }}</span>
    </h3>

    <div class="flex gap-2">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false, default: "" },
  icon: { type: String, required: false, default: "fa-user" },
  divider: { type: Boolean, required: false, default: true },
});
</script>
