<script setup lang="ts">
import { Document } from "~~/models/document";
import * as datefns from "date-fns";

definePageMeta({
  layout: "core",
});
const props = defineProps({
  clientId: { type: String, default: "" },
  list: { type: Array as () => Document[], default: null },
});

const modal = ref(false);
const offer = ref(new Document());
const controller = () => useDocument();
controller().list(false, props.clientId);
</script>

<template>
  <Loading v-if="controller().loading" />

  <div v-else>
    <FormHeader
      :title="controller().type(true)"
      :icon="controller().type() === 'offers' ? 'fa-file-invoice' : 'fa-file-invoice-dollar'"
      :divider="false"
    >
      <template #buttons>
        <NuxtLink class="btn btn-sm btn-neutral gap-2 no-underline" :href="`/${controller().type()}/new`">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New
          {{ controller().singularType() }}
        </NuxtLink>
      </template>
    </FormHeader>

    <div v-if="modal">
      <input type="checkbox" id="offerToInvoice-modal" class="modal-toggle" />
      <label for="offerToInvoice-modal" class="modal cursor-pointer">
        <label class="modal-box relative">
          <DocumentToInvoice :offer="offer" />
        </label>
      </label>
    </div>
    <div v-if="(!list || list.length === 0) && controller().items.length === 0" class="text-center mt-20">
      <div class="prose">
        <FaIcon
          :icon="controller().type() === 'offers' ? 'fa-solid fa-file-invoice' : 'fa-solid fa-file-invoice-dollar'"
          class="text-5xl text-accent"
        />
        <h1 class="!text-accent mt-5">No {{ controller().type() }}</h1>
        <p>
          It appears you have
          <strong class="text-accent">no {{ controller().type() }}</strong>
          created. Go ahead and create one.
        </p>
      </div>
      <div class="mt-10">
        <NuxtLink :href="'/' + controller().type() + '/new'" class="btn btn-primary btn-sm gap-2">
          <FaIcon icon="fa-solid fa-plus-circle " />
          new {{ controller().singularType() }}
        </NuxtLink>
      </div>
    </div>
    <div v-else class="">
      <table class="table table-compact w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>
              {{ controller().type() === "invoices" ? "Offer" : "Invoiced" }}
            </th>
            <th width="50"></th>
            <th>Date</th>
            <th>Net</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover" v-for="io in list || controller().items" :key="io.id">
            <td width="200">
              <NuxtLink :href="'/' + (controller().type() || type) + '/' + io.id" class="link">
                {{ io.number }}
              </NuxtLink>
              <br />
              <small class="opacity-50">last modified {{ useFormat.date(io.updatedAt) }}</small>
            </td>
            <td>
              {{ io.client.name }}
              <br />
              <small class="opacity-50">{{ io.client.number }}</small>
            </td>
            <td>
              <span v-if="io.offer.id !== ''" class="text-warning">
                {{ useFormat.toCurrency(io.offer.data.total) }}
                <br />
                <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2">
                  <NuxtLink :href="`/offers/${io.offer.id}`">
                    {{ io.offer.number }}
                  </NuxtLink>
                </span>
              </span>
              <span v-if="io.invoices.length > 0" class="text-warning">
                {{ useFormat.toCurrency(io.invoices.reduce((p, c) => (p += c.data.total), 0)) }}
                <br />
                <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2" v-for="inv in io.invoices">
                  <NuxtLink :href="`/invoices/${inv.id}`">
                    {{ inv.number }}
                  </NuxtLink>
                </span>
              </span>
              <span v-else></span>
            </td>
            <td class="text-center">
              <span
                class="btn btn-circle btn-xs mr-2"
                :class="io.status === 'pending' ? (datefns.isPast(io.data.dueDate) ? 'btn-error' : '') : 'btn-success'"
                @click="controller().setStatus(io)"
              >
                <FaIcon :icon="io.status == 'pending' ? 'fa-regular fa-clock' : 'fa-check'" />
              </span>
            </td>

            <td width="200">
              {{ useFormat.date(io.data.date) }}
              <br />
              <small :class="io.status === 'pending' && datefns.isPast(io.data.dueDate) ? 'text-error' : 'opacity-50'">
                due on {{ useFormat.date(io.data.dueDate) }}
              </small>
            </td>

            <td width="200">
              {{ useFormat.toCurrency(io.data.net) }}
              <br />
              &nbsp;
            </td>
            <td width="200">
              <span>{{ useFormat.toCurrency(io.data.total) }}</span>
              <br />
              <small class="opacity-50">taxes {{ useFormat.toCurrency(io.data.total - io.data.net) }}</small>
            </td>
            <td width="50" class="text-right">
              <ContextMenu>
                <li>
                  <NuxtLink href="/#" @click="controller().download(io)">
                    <FaIcon icon="fa-regular fa-file-pdf" />
                    Download PDF
                  </NuxtLink>
                </li>
                <li v-if="io.type === 'offer' && io.invoices.reduce((p, c) => (p += c.data.net), 0) < io.data.net">
                  <NuxtLink href="#">
                    <label for="offerToInvoice-modal">
                      <FaIcon icon="fa-solid fa-file-invoice-dollar" />
                      Create Invoice
                    </label>
                  </NuxtLink>
                </li>
              </ContextMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-box {
  max-height: 800px;
}
</style>
