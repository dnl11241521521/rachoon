<script setup lang="ts">
useUser().form();
const roles = ["admin", "user"];
</script>

<template>
  <Loading v-if="useUser().loading" />
  <form @submit="useUser().save" v-else>
    <FormHeader :title="useUser().item.data.fullName" icon="fa-user">
      <template #buttons>
        <button v-if="useUser().item.id !== null" class="btn btn-sm btn-error gap-2 btn-outline">
          <FaIcon icon="fa-solid fa-close" />
          Delete
        </button>
        <button class="btn btn-sm btn-neutral" type="submit">
          <FaIcon icon="fa-solid fa-save " />
          Save
        </button>
      </template>
    </FormHeader>
    <FormSection title="User Information" description="Manage your users">
      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">
            Username
            <span class="text-red-700">*</span>
          </span>
        </label>
        <input
          type="text"
          v-model="useUser().item.data.username"
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
          v-model="useUser().item.data.fullName"
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
          v-model="useUser().item.email"
          required
          class="input input-bordered input-sm w-full max-w-xs"
        />
      </div>
      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">
            Role
            <span class="text-red-700">*</span>
          </span>
        </label>
        <select class="select select-bordered select-sm" v-model="useUser().item.role" required>
          <option v-for="r in roles" :value="r">{{ r }}</option>
        </select>
      </div>
    </FormSection>
  </form>
</template>
