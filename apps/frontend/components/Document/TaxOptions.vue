<script setup>
const document = useDocument().item;
const taxOptions = useSettings().settings.taxes.options;
</script>

<template>
  <div class="prose">
    <h3 class="mb-3">Tax</h3>
  </div>
  <label class="flex flex-row gap-2 mb-2" v-for="(o, i) in taxOptions" :key="i">
    <input
      type="radio"
      name="taxoption"
      class="radio radio-xs"
      :disabled="useDocument().offerToConvert.id !== ''"
      @change="useDocument().setTaxOption(o)"
      :checked="o.title === document.data.taxOption.title"
    />
    <span class="label-text !text-base-content">{{ o.title }}</span>
  </label>
</template>
