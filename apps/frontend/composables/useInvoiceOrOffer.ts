import { Client, type ClientType } from "~~/models/client";
import { InvoiceOrOffer } from "~~/models/invoiceOrOffer";

import * as dateFns from "date-fns";
import _ from "lodash";
import type { Template } from "~/models/template";

export default defineStore("invoiceOrOffer", () => {
  const type = (firstToUpper = false) => {
    let res = useRoute().path.split("/")[1];
    if (firstToUpper) res = res.charAt(0).toUpperCase() + res.slice(1);
    return res;
  };
  const singularType = () => type().slice(0, type().length - 1);
  const invoicesOrOffers = ref<InvoiceOrOffer[]>([]);
  const invoiceOrOffer = ref(new InvoiceOrOffer());
  const clients = ref<Client[]>([]);
  const templates = ref<Template[]>([]);
  const hasErrors = ref(false);
  const title = ref();
  const mustSave = ref(0);
  const offerToConvert = ref(new InvoiceOrOffer());

  const loading = ref(false);

  function setTemplate(id: string) {
    invoiceOrOffer.value.templateId = id;
  }

  function setClient(client: ClientType) {
    invoiceOrOffer.value.clientId = client.id;
    invoiceOrOffer.value.client = client;
    if (client.data.conditions.discount.value > 0) {
      client.data.conditions.discount.value,
        client.data.conditions.discount.valueType,
        invoiceOrOffer.value.addDiscountCharge({
          id: Date.now().toString(),
          title: "Client discount",
          type: "discount",
          value: client.data.conditions.discount.value,
          valueType: client.data.conditions.discount.valueType,
          amount: 0,
        });
    }
    if (invoiceOrOffer.value.data.positions[0].price === null && invoiceOrOffer.value.data.positions[0].quantity === null) {
      invoiceOrOffer.value.removePosition(0);
    }
    invoiceOrOffer.value.rebuild();
  }

  function offerToInvoice(io: InvoiceOrOffer) {}

  function setStatus(io: InvoiceOrOffer) {
    const status = io.status === "pending" ? (io.type === "invoice" ? "paid" : "accepted") : "pending";
    io.setStatus(status);
    useApi().invoicesOrOffers(singularType()).setStatus(io.id, status);
  }

  async function save() {
    if (invoiceOrOffer.value.errors().length > 0) {
      hasErrors.value = true;
      return;
    }
    hasErrors.value = false;
    const isNew = invoiceOrOffer.value.id === "";
    const ioo = await useApi().invoicesOrOffers(singularType()).saveOrUpdate(invoiceOrOffer.value, !isNew);
    if (isNew) {
      useRouter().replace(`/${type()}/${ioo.id}`);
    }
    mustSave.value = 0;
  }

  async function list() {
    loading.value = true;
    invoicesOrOffers.value = await useApi().invoicesOrOffers(singularType()).getAll();
    loading.value = false;
  }

  async function preview() {
    return (await useRender(invoiceOrOffer.value, true)) as string[];
  }

  async function download(io?: InvoiceOrOffer) {
    const dio = io || invoiceOrOffer.value;
    const data = (await useRender(dio)) as string;
    let a = document.createElement("a");
    a.href = data;
    a.download = dio.number + ".pdf";
    a.click();
  }

  function updated() {
    invoiceOrOffer.value.rebuild();
    mustSave.value++;
  }

  async function duplicate(id: string) {
    loading.value = true;
    const duplicate = await useApi().invoicesOrOffers(singularType()).duplicate(id);
    useRouter().push(`/${type()}/${duplicate.id}`);
    loading.value = false;
  }

  async function maybeDoConvertOffer() {
    if (useRoute().query.offer) {
      _.mergeWith(
        offerToConvert.value,
        await useApi()
          .invoicesOrOffers("offer")
          .get(useRoute().query.offer as string),
      );
      invoiceOrOffer.value.removePositions();
      offerToConvert.value.rebuild();
      invoiceOrOffer.value.client = offerToConvert.value.client;
      invoiceOrOffer.value.clientId = offerToConvert.value.clientId;
      invoiceOrOffer.value.offerId = offerToConvert.value.id;
      if (useRoute().query.option === "partial") {
        offerToConvert.value.data.positions.map((p) => {
          if (useRoute().query.valueType === "percent") p.price = (p.price / 100) * Number(useRoute().query.value);
          if (useRoute().query.valueType === "fixed") p.price = ((Number(useRoute().query.value) / 100) * p.totalPercentage) / p.quantity;
          p.price = Math.round(p.price * 100) / 100;
          invoiceOrOffer.value.addPosition(p);
        });
      }
      if (useRoute().query.option === "final") {
        const previousNet = offerToConvert.value.invoices.reduce((p, c) => p + c.data.net, 0);
        const newNet = offerToConvert.value.data.net - previousNet;
        offerToConvert.value.data.positions.map((p) => {
          p.price = ((newNet / 100) * p.totalPercentage) / p.quantity;
          p.price = Math.round(p.price * 100) / 100;
          invoiceOrOffer.value.addPosition(p);
        });
      }

      if (["full", "final"].includes(useRoute().query.option as string)) {
        offerToConvert.value.data.discountsCharges.map((d) => {
          invoiceOrOffer.value.addDiscountCharge(d);
        });
      }
      invoiceOrOffer.value.invoices = offerToConvert.value.invoices;
      invoiceOrOffer.value.rebuild();
    } else {
      _.mergeWith(offerToConvert.value, new InvoiceOrOffer());
    }
  }

  async function form() {
    loading.value = true;
    clients.value = await useApi().clients().getAll();
    templates.value = await useApi().templates().getAll();
    const id = useRoute().params["id"] as string;

    invoiceOrOffer.value = new InvoiceOrOffer();
    if (id === "new") {
      invoiceOrOffer.value.number = await useApi().invoicesOrOffers(singularType()).getNextNumber();
      title.value = invoiceOrOffer.value.number;

      invoiceOrOffer.value.data.dueDate = dateFns.add(invoiceOrOffer.value.data.date, {
        days: useProfile().me.organization.settings.invoices.dueDays,
      });
      invoiceOrOffer.value.data.dueDays = dateFns.differenceInCalendarDays(
        invoiceOrOffer.value.data.dueDate,
        invoiceOrOffer.value.data.date,
      );
      await maybeDoConvertOffer();
    } else {
      _.mergeWith(invoiceOrOffer.value, await useApi().invoicesOrOffers(singularType()).get(id));
      title.value = invoiceOrOffer.value.number;
    }
    invoiceOrOffer.value.rebuild();
    if (!invoiceOrOffer.value.data.taxOption) {
      invoiceOrOffer.value.data.taxOption = useSettings().settings.taxes.options.filter((o) => o.default)[0];
    }
    mustSave.value = -1;
    loading.value = false;
  }

  async function del() {
    await useApi().invoicesOrOffers("invoice-or-offer").delete(invoiceOrOffer.value.id);
    useRouter().replace(`/${type()}/`);
  }
  return {
    invoiceOrOffer,
    title,
    loading,
    invoicesOrOffers,
    hasErrors,
    clients,
    templates,
    mustSave,
    offerToConvert,
    del,
    save,
    form,
    type,
    singularType,
    list,
    setTemplate,
    setClient,
    preview,
    download,
    updated,
    setStatus,
    offerToInvoice,
    duplicate,
  };
});
// some test
