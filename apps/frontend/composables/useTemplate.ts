import { Template } from "~~/models/template";
import _ from "lodash";

export default defineStore("template", () => {
  const type = "templates";
  let templates = ref<Template[]>([]);
  const cached = ref<{ [id: string]: Template }>({});

  const hasErrors = ref(false);

  const singularType = type.slice(0, type.length - 1);

  const title = ref();

  const loading = ref(false);
  const template = ref(new Template());
  const defaultTemplate = ref(new Template());

  async function save(e: Event) {
    e.preventDefault();
    if (template.value.errors().length > 0) {
      hasErrors.value = true;
      return;
    }
    hasErrors.value = false;
    const isNew = template.value.id === "";
    const c = await useApi().templates().saveOrUpdate(template.value, !isNew);
    if (isNew) {
      useRouter().replace(`/${type}/${c.id}`);
    }
  }

  async function list() {
    loading.value = true;
    templates.value = await useApi().templates().getAll();
    loading.value = false;
  }

  async function get(id: string): Promise<Template> {
    if (cached.value[id]) {
      return cached.value[id];
    }
    loading.value = true;

    const t = id === "default" ? await useApi().templates().getDefault() : await useApi().templates().get(id);
    const tpl = _.mergeWith(new Template(), t);
    cached.value[id] = tpl;
    loading.value = false;
    return tpl;
  }

  async function duplicate(id: string) {
    loading.value = true;
    const duplicate = await useApi().templates().duplicate(id);
    useRouter().push(`/templates/${duplicate.id}`);
    loading.value = false;
  }

  async function getDefault() {
    loading.value = true;
    defaultTemplate.value = await useApi().templates().getDefault();
    loading.value = false;
  }

  async function form() {
    const id = useRoute().params["id"] as string;

    loading.value = true;
    if (id === "new") {
      template.value = new Template();
      title.value = template.value.title;
    } else {
      template.value = _.mergeWith(template.value, await useApi().templates().get(id));
      title.value = template.value.title;
    }

    loading.value = false;
  }

  return {
    template,
    save,
    form,
    loading,
    title,
    templates,
    singularType,
    list,
    get,
    getDefault,
    duplicate,
    defaultTemplate,
    hasErrors,
  };
});
