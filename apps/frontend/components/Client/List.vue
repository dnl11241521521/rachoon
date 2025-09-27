<script setup lang="ts">
useClient().list();
</script>

<template>
  <Loading v-if="useClient().loading" />
  <div v-else>
    <FormHeader title="Clients" icon="fa-user" :divider="false">
      <template #buttons>
        <NuxtLink class="btn btn-sm btn-neutral gap-2 no-underline" href="/clients/new">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New client
        </NuxtLink>
      </template>
    </FormHeader>
    <div class="text-center mt-20" v-if="useClient().clients.length === 0">
      <div class="prose">
        <FaIcon icon="fa-users" class="text-5xl" />
        <h1 class="mt-5">No clients</h1>
        <p>
          It appears you have
          <strong>no clients</strong>
          created. Go ahead and
          <NuxtLink href="/clients/new">create one</NuxtLink>
          .
        </p>
      </div>
    </div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th width="200">#</th>
              <th>Name</th>
              <th width="200">Offers</th>
              <th width="200">Invoices</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover" v-for="c in useClient().clients" :key="c.id">
              <td>
                <NuxtLink :href="`/clients/${c.id}`" class="link">
                  {{ c.number }}
                </NuxtLink>
                <br />
                <small class="opacity-50">last modified {{ useFormat.date(c.updatedAt) }}</small>
              </td>
              <td>
                {{ c.name }}
                <br />
                <small class="opacity-50">{{ c.data.info.vat }}</small>
              </td>
              <td>
                <NuxtLink :to="`/offers/client/${c.id}`">{{ c.totalOffers }} Offers</NuxtLink>
                <br />
                <span v-if="c.pendingOffers > 0" class="text-error text-opacity-50">{{ c.pendingOffers }}</span>
                &nbsp;
              </td>
              <td>
                <NuxtLink :to="`/invoices/client/${c.id}`">{{ c.totalInvoices }} Invoices</NuxtLink>
                <br />
                <small v-if="c.pendingInvoices > 0" class="text-error text-opacity-50">pending {{ c.pendingInvoices }}</small>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    {{ useClient().pages }}
  </div>
</template>
