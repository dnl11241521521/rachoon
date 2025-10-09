<script setup>
const fees = useSettings().settings.reminders.fees;
</script>
<template>
  <FormSection title="Reminder fees" description="Set the default fees for your reminders.">
    <table class="table table-compact w-full m-0">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th width="150" class="text-left">Value</th>
          <th></th>
          <th width="50"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, i) in fees" :key="i">
          <td>
            <div class="form-control">
              <input type="text" placeholder="title" v-model="f.title" class="input input-bordered input-sm" />
            </div>
          </td>
          <td>
            <div class="input-group">
              <input
                type="number"
                placeholder="0"
                v-model="f.value"
                v-maska="{
                  mask: '#*.##',
                  preprocessor: (val) => {
                    return f.valueType === 'percent' ? useFormat.max100(val) : val;
                  },
                }"
                class="input input-bordered input-sm w-full"
              />
              <select class="select select-bordered select-sm bg-base-300" v-model="f.valueType">
                <option selected value="percent">%</option>
                <option value="fixed">
                  {{ useCountries.currencies.find((c) => c.cc === useProfile().me.organization.settings.general.currency).symbol }}
                </option>
              </select>
            </div>
          </td>
          <td></td>
          <td class="text-right">
            <button class="btn btn-ghost btn-circle btn-xs mr-2" @click="useSettings().settings.removeFee(i)">
              <FaIcon icon="fa-xmark" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-5">
      <button class="btn btn-xs btn-outline gap-1" @click="useSettings().settings.addFee()">
        <FaIcon icon="fa-add mr-5" />
        Add fee
      </button>
    </div>
  </FormSection>
</template>
