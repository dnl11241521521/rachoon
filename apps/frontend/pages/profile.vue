<script lang="ts" setup>
definePageMeta({
  layout: "core",
});
const profile = useProfile().me;
useProfile().newPassword = null;
useProfile().newPasswordRepeat = null;
function save() {}
</script>
<template>
  <div>
    <FormHeader title="Profile" icon="fa-user">
      <template #buttons>
        <NuxtLink to="/logout" class="btn btn-sm btn-ghost text-error no-underline">
          <FaIcon icon="fa-solid fa-right-from-bracket" />
          Logout
        </NuxtLink>
      </template>
    </FormHeader>
    <FormSection title="Profile Information" description="Update your profile information.">
      <div class="flex gap-5">
        <form @submit="useProfile().save" class="w-1/2">
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Username
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              v-model="profile.data.username"
              placeholder="username"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Full name
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              v-model="profile.data.fullName"
              placeholder=""
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                E-mail
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="mail@example.com"
              v-model="profile.email"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <button type="submit" class="btn btn-sm gap-2 mt-5" @click="save">
            <FaIcon icon="fa-solid fa-save " />
            Save
          </button>
        </form>
        <div class="w-1/2 text-center">
          <img v-if="useProfile().me.data.avatar !== ''" :src="useProfile().me.data.avatar" class="h-32 w-auto inline-block rounded-full" />
          <div class="form-control">
            <input
              type="file"
              class="file-input file-input-bordered"
              accept=".jpeg,.jpg,.png,image/jpeg,image/png"
              aria-label="upload image button"
              @change="useProfile().selectFile"
            />
            <label class="label">
              <span class="label-text-alt">image/jpeg, image/png</span>
              <span class="label-text-alt">max 5kb</span>
            </label>
          </div>
        </div>
      </div>
    </FormSection>

    <FormSection title="Update password" description="Change your account password.">
      <form @submit="useProfile().savePassword">
        <div>
          <label class="label w-full max-w-xs">
            <span class="label-text">
              Password
              <span class="text-red-700">*</span>
            </span>
          </label>
          <input
            type="password"
            placeholder="************"
            required
            autocomplete="new-password"
            v-model="useProfile().newPassword"
            class="input input-bordered input-sm w-full max-w-xs"
          />
        </div>
        <div>
          <label class="label w-full max-w-xs">
            <span class="label-text">
              Password repeat
              <span class="text-red-700">*</span>
            </span>
          </label>
          <input
            type="password"
            autocomplete="new-password"
            placeholder="************"
            required
            class="input input-bordered input-sm w-full max-w-xs"
            v-model="useProfile().newPasswordRepeat"
          />
        </div>
        <div class="text-error text-sm" v-if="useProfile().newPassword !== useProfile().newPasswordRepeat">Passwords don't match</div>
        <button type="submit" class="btn btn-sm mt-5 gap-2">
          <FaIcon icon="fa-solid fa-key " />
          Save new password
        </button>
      </form>
    </FormSection>
  </div>
</template>
