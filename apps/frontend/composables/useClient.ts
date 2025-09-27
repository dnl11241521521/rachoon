import { Client } from "~~/models/client";
import _ from "lodash";
import Base from "./_base";

class ClientStore extends Base<Client> {
  public save = async (e: Event) => {
    super.save(e);
    const isNew = this.item.value?.id === "";
    const c = await useApi().clients().saveOrUpdate(this.item.value!, !isNew);
    if (isNew) {
      useRouter().replace(`/${this.type}/${c.id}`);
    }
  };

  public list = async (loadMore: boolean = false) => {
    super.list(loadMore);

    const res = await useApi().clients().getAll(this.page.value, this.perPage.value);
    this.pages.value = res.pages;
    if (loadMore) {
      this.items.value = this.items.value.concat(res.rows);
    } else {
      this.items.value = res.rows;
    }
    this.loading.value = false;
  };

  public form = async () => {
    const id = useRoute().params["id"] as string;

    this.loading.value = true;
    this.item.value = new Client();
    if (id === "new") {
      this.item.value.number = await useApi().number("client").get();
    } else {
      this.item.value = _.mergeWith(this.item.value, await useApi().clients().get(id));
    }

    this.loading.value = false;
  };
}

export default defineStore("client", () => new ClientStore("clients"));
