<script setup>
import * as dateFns from "date-fns";
const date = dateFns.format(Date.now(), "yyyy-MM-dd H:m:s");
</script>
<template>
  <FormSection title="Locale" description="Set currency and Date format">
    <div class="flex">
      <div class="w-1/2">
        <div>
          <label class="label w-full max-w-xs">
            <span class="label-text">Currency</span>
          </label>
          <select class="select select-bordered select-sm bg-base-300" v-model="useSettings().settings.general.currency">
            <option v-for="c in useCountries.currencies" :value="c.cc">{{ c.cc }} ({{ c.symbol }})</option>
          </select>
        </div>
        <div>
          <label class="label w-full max-w-xs">
            <span class="label-text">Locale</span>
          </label>
          <select class="select select-bordered select-sm bg-base-300" v-model="useSettings().settings.general.locale">
            <option v-for="(v, k) in useCountries.locales" :value="k">
              {{ v[1] }}
            </option>
          </select>
        </div>
      </div>
      <div class="w-1/2 prose">
        <p>Currency preview</p>
        <h2 class="m-0 p-0">
          {{ useFormat.toCurrency(100000) }}
        </h2>
        <p class="mt-5">Date preview</p>
        <h2 class="m-0 p-0">
          {{ useFormat.date(date) }}
        </h2>
      </div>
    </div>
  </FormSection>
</template>
