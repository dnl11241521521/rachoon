<script setup lang="ts">
defineProps({
  color: { type: String, default: "primary" },
});
</script>

<template>
  <div class="form-control">
    <label class="input-group input-group-sm">
      <span class="w-60">{{ $props.color }}</span>
      <input
        type="text"
        placeholder="#ff00ff"
        v-maska="{ mask: '!#HHHHHH', tokens: { H: { pattern: /[0-9a-fA-F]/, uppercase: true } } }"
        v-model="useTemplate().item.data.colors[$props.color]"
        class="input input-bordered input-sm w-24"
      />
      <span
        class="border border-white border-opacity-20"
        :style="'background-color:' + useTemplate().item.data.colors[$props.color]"
      ></span>
    </label>
  </div>
</template>
