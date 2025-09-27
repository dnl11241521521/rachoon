<template>
  <div>
    <FormSection title="Organization" description="Organization name and VAT number">
      <div class="flex gap-5">
        <div class="w-1/2">
          <label class="label w-full max-w-xs">
            <span class="label-text">
              Organization name
              <span class="text-red-700">*</span>
            </span>
          </label>
          <input
            type="text"
            v-model="useProfile().me.organization.name"
            placeholder="Organization name"
            required
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <label class="label w-full max-w-xs">
            <span class="label-text">Name addition</span>
          </label>
          <input
            type="text"
            v-model="useProfile().me.organization.data.info.addition"
            placeholder=""
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <label class="label w-full max-w-xs">
            <span class="label-text">VAT-Number</span>
          </label>
          <input
            type="text"
            placeholder="VAT-Number"
            v-model="useProfile().me.organization.data.info.vat"
            class="input input-bordered input-sm w-full max-w-xs"
          />
        </div>
        <div class="w-1/2 text-center">
          <img
            v-if="useProfile().me.organization.data.logo !== ''"
            :src="useProfile().me.organization.data.logo"
            class="h-16 w-auto inline-block"
          />
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pick a file</span>
            </label>
            <input
              type="file"
              class="file-input file-input-bordered"
              accept=".jpeg,.jpg,.png,image/jpeg,image/png"
              aria-label="upload image button"
              @change="useSettings().selectFile"
            />
            <label class="label">
              <span class="label-text-alt">image/jpeg, image/png</span>
              <span class="label-text-alt">max 15kb</span>
            </label>
          </div>
        </div>
      </div>
    </FormSection>
    <FormSection title="Address" description="Contact Information">
      <div>
        <div class="grid grid-cols-2 gap-5">
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Street
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Street"
              v-model="useProfile().me.organization.data.address.street"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                ZIP
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="ZIP"
              v-model="useProfile().me.organization.data.address.zip"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                City
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="City"
              v-model="useProfile().me.organization.data.address.city"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Country
                <span class="text-red-700">*</span>
              </span>
            </label>
            <select
              class="select select-bordered select-sm bg-base-300 w-full max-w-xs"
              v-model="useProfile().me.organization.data.address.country"
            >
              <option v-for="c in useCountries.countries" :value="c.country">
                {{ c.country }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </FormSection>
  </div>
</template>
