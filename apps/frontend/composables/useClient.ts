import { Client } from "~~/models/client";
import _ from "lodash";

export default defineStore("client", () => {
  const type = "clients";
  let clients = ref<Client[]>([]);
  const page = ref(1);
  const perPage = ref(5);

  const pages = ref(0);

  const hasErrors = ref(false);

  const singularType = type.slice(0, type.length - 1);

  const title = ref();

  const loading = ref(false);
  const client = ref(new Client());

  async function save(e: Event) {
    e.preventDefault();
    if (client.value.errors().length > 0) {
      hasErrors.value = true;
      return;
    }
    hasErrors.value = false;
    const isNew = client.value.id === "";
    const c = await useApi().clients().saveOrUpdate(client.value, !isNew);
    if (isNew) {
      useRouter().replace(`/${type}/${c.id}`);
    }
  }

  async function list() {
    loading.value = true;
    const res = await useApi().clients().getAll(page.value, perPage.value);
    console.log(res);
    pages.value = res.pages;
    clients.value = res.rows;
    loading.value = false;
  }

  async function form() {
    const id = useRoute().params["id"] as string;

    loading.value = true;
    client.value = new Client();
    if (id === "new") {
      client.value.number = await useApi().number("client").get();
      title.value = client.value.number;
    } else {
      client.value = _.mergeWith(client.value, await useApi().clients().get(id));
      title.value = client.value.number;
    }

    loading.value = false;
  }

  return {
    client,
    save,
    form,
    loading,
    title,
    clients,
    singularType,
    list,
    hasErrors,
    pages,
  };
});
