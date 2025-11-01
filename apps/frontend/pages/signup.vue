<script setup lang="ts">
import { getActivePinia } from "pinia";
getActivePinia()._s.forEach((s) => s.$reset());

const organizationUrl = (slug: string) => {
  const l = window.location;
  return `${l.protocol}//${slug}.${l.hostname}${l.port ? `:${l.port}` : ""}`;
};

const step = ref(1);
</script>
<template>
  <div class="grid h-screen place-items-center">
    <div class="card card-compact w-96 bg-base-100 shadow-xl p-10">
      <Logo />
      <div class="card-body prose text-center">
        <form v-on:submit="useSignup().signUp">
          <div v-if="step === 1">
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Company name
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Your company"
              required
              v-model="useSignup().organization.name"
              class="input input-bordered input-sm w-full max-w-xs"
            />
            <label class="label w-full max-w-xs">
              <span class="label-text">Slug</span>
            </label>
            <input
              type="text"
              :placeholder="useSignup().slug"
              v-model="useSignup().organization.slug"
              class="input input-bordered input-sm w-full max-w-xs"
            />
            <div
              v-if="useSignup().slugInUse !== null"
              :class="` mt-2 ${useSignup().slugInUse === true ? 'text-error' : 'text-success'} items-center`"
            >
              <span v-if="useSignup().slugInUse !== null" class="mr-2">
                <FaIcon icon="fa-solid fa-check" v-if="useSignup().slugInUse === false" />
                <FaIcon icon="fa-solid fa-close" v-if="useSignup().slugInUse === true" />
              </span>
              <span v-if="useSignup().slugInUse === true">
                <span class="font-bold">{{ useSignup().slug }}</span>
                already in use.
              </span>
              <span v-else>
                <span class="font-bold">{{ useSignup().slug }}</span>
                is available.
              </span>
            </div>
          </div>

          <div v-if="step === 2">
            <div>
              <label class="label w-full max-w-xs">
                <span class="label-text">
                  E-mail
                  <span class="text-red-700">*</span>
                </span>
              </label>
              <input
                type="email"
                pattern=".+@.+\..+"
                placeholder="you@example.com"
                required
                v-model="useSignup().user.email"
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
                placeholder="Your name"
                v-model="useSignup().user.data.fullName"
                required
                class="input input-bordered input-sm w-full max-w-xs"
              />
            </div>

            <div>
              <label class="label w-full max-w-xs">
                <span class="label-text">
                  Password
                  <span class="text-red-700">*</span>
                </span>
              </label>
              <input
                type="password"
                placeholder="**********"
                required
                v-model="useSignup().user.password"
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
                placeholder="**********"
                required
                v-model="useSignup().user.passwordRepeat"
                class="input input-bordered input-sm w-full max-w-xs"
              />
            </div>
            <div
              v-if="useSignup().user.password !== '' && useSignup().user.password !== useSignup().user.passwordRepeat"
              class="text-error mt-2"
            >
              Passwords don't match.
            </div>
          </div>

          <div class="divider"></div>

          <div class="center flex justify-between" v-if="step === 2">
            <label class="btn btn-sm btn-neutral mt-5" @click="step = 1">Back</label>

            <button class="btn btn-sm btn-success mt-5" type="submit">Sign up now</button>
          </div>
          <div class="center" v-if="step === 1">
            <button type="button" class="btn btn-sm btn-neutral mt-5" @click="step = 2" :disabled="useSignup().slugInUse !== false">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="text-sm">
      Already have an account?
      <NuxtLink class="link" to="/login">Go to login</NuxtLink>
    </div>
  </div>
</template>
