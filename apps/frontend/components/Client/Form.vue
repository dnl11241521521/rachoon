<script setup lang="ts">
useClient().form();
</script>

<template>
  <Loading v-if="useClient().loading" />

  <form @submit="useClient().save" v-else>
    <FormHeader :title="useClient().item?.name || `${useClient().item?.id === null ? 'New' : 'Edit'} Client`" icon="fa-user">
      <template #buttons>
        <button v-if="useClient().item?.id !== ''" class="btn btn-sm btn-error gap-2 btn-outline">
          <FaIcon icon="fa-solid fa-close" />
          Delete
        </button>
        <button class="btn btn-sm btn-neutral" type="submit">
          <FaIcon icon="fa-solid fa-save " />
          {{ useClient().item?.id === "" ? "Create Client" : "Save" }}
        </button>
      </template>
    </FormHeader>

    <ul v-if="useClient().hasErrors" class="border-2 border-warning rounded p-5 mt-5 mb-10">
      <li v-for="e in useClient().item?.errors()" class="text-warning">
        {{ e }}
      </li>
    </ul>
    <FormSection title="Client Information" description="Manage your clients">
      <ClientFormBasic />
    </FormSection>
    <FormSection title="Address" description="Enter the full registered address.">
      <ClientFormAddress />
    </FormSection>
    <FormSection title="Primary Contact" description="Provide main contact person and email address.">
      <ClientFormContact />
    </FormSection>
    <FormSection title="Conditions" description="Specify agreed payment terms and conditions.">
      <ClientFormConditions />
    </FormSection>
  </form>
</template>
