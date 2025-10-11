class EnvStore {
  info = <Ref<null | any>>ref(null);

  loading = ref(false);
  init = async () => {
    if (this.info.value !== null) return;
    this.loading.value = true;
    this.info.value = ((await useFetch("/app/info")) as any).data.value;
    console.log("BASE_URL:", await this.info.value.BASE_URL);
    this.loading.value = false;
  };
}

export default defineStore("info", () => new EnvStore());
