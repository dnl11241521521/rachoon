<script setup lang="ts">
const controller = () => useUser();
controller().form();
const roles = ["admin", "user"];
</script>

<template>
  <Loading v-if="controller().loading" />
  <form @submit="controller().save" v-else>
    <FormHeader :title="controller().item.data.fullName" icon="fa-user">
      <template #buttons>
        <label v-if="controller().item.id !== null" class="btn btn-sm btn-ghost text-error gap-2" @click="controller().delete()">
          <FaIcon icon="fa-solid fa-close" />
          Delete
        </label>
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
          v-model="controller().item.data.username"
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
          v-model="controller().item.data.fullName"
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
          v-model="controller().item.email"
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
        <select class="select select-bordered select-sm" v-model="controller().item.role" required>
          <option v-for="r in roles" :value="r">{{ r }}</option>
        </select>
      </div>
    </FormSection>
  </form>
</template>
