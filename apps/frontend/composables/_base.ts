import { type IBase } from "@repo/common/Base";

export default class Base<T extends IBase> {
  constructor(type: string) {
    this.type.value = type;
  }

  public items = ref<T[]>([]);
  public item = ref<T>();
  public hasErrors = ref(false);

  public page = ref(1);
  public type = ref("");
  public pages = ref(0);
  public loading = ref(false);
  public perPage = ref(5);
  public singularType = () => this.type.value.slice(0, this.type.value.length - 1);

  public async save(e: Event) {
    e.preventDefault();
    if (this.item.value!.errors().length > 0) {
      this.hasErrors.value = true;
      return;
    }
    this.hasErrors.value = false;
  }

  public async list(loadMore: boolean = false) {
    if (!loadMore) {
      this.page.value = 1;
      this.loading.value = true;
    }
  }

  public hasMore = () => {
    return this.page.value < this.pages.value;
  };

  public loadMore = () => {
    if (this.hasMore()) {
      this.page.value++;
      this.list(true);
    }
  };
}
