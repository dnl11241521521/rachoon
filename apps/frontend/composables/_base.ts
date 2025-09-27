import { type IBase } from "@repo/common/Base";
import type { getAllFunc } from "./useApi";

export default class Base<T extends IBase> {
  constructor(type: string) {
    this.list = this.list.bind(this);
    this.save = this.save.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  type = (firstToUpper = false) => {
    let res = useRoute().path.split("/")[1];
    if (firstToUpper) res = res.charAt(0).toUpperCase() + res.slice(1);
    return res;
  };

  items: Ref<T[]> = ref([]);
  item = ref<T>();
  hasErrors = ref(false);

  page = ref(1);
  pages = ref(0);
  loading = ref(false);
  perPage = ref(5);
  singularType = () => this.type().slice(0, this.type().length - 1);

  async save(e: Event) {
    e.preventDefault();
    if (this.item.value!.errors().length > 0) {
      this.hasErrors.value = true;
      return;
    }
    this.hasErrors.value = false;
  }

  async list(loadMore: boolean = false, loadAllFunc: getAllFunc<T>) {
    if (!loadMore) {
      this.page.value = 1;
      this.loading.value = true;
    }
    const res = await loadAllFunc(this.page.value, this.perPage.value);
    this.pages.value = res.pages;
    if (loadMore) {
      this.items.value = [...this.items.value, ...res.rows];
    } else {
      this.items.value = res.rows as T[];
    }
    this.loading.value = false;
  }

  hasMore = () => {
    return this.page.value < this.pages.value;
  };

  loadMore = () => {
    if (this.hasMore()) {
      this.page.value++;
      this.list(true);
    }
  };
}
