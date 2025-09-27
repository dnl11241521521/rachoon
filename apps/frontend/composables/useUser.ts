import { User } from "~~/models/user";
import _ from "lodash";

export default defineStore("user", () => {
  const type = "users";
  let users = ref<User[]>([]);
  const user = ref(new User());
  const title = ref();
  const password = ref(null);
  const passwordRepeat = ref(null);
  const singularType = type.slice(0, type.length - 1);

  const loading = ref(false);

  async function save(e: Event) {
    e.preventDefault();

    const isNew = user.value.id === null;
    if (password.value !== passwordRepeat.value) return;
    const u = await useApi()
      .users()
      .saveOrUpdate(isNew ? { ...user.value, password: password.value } : user.value, !isNew);
    if (isNew) {
      useRouter().replace(`/${type}/${u.id}`);
    }
  }

  async function list() {
    loading.value = true;
    users.value = await useApi().users().getAll();
    loading.value = false;
  }

  async function form() {
    const id = useRoute().params["id"] as string;

    loading.value = true;
    user.value = new User();
    if (id === "new") {
      title.value = "New user";
    } else {
      user.value = _.mergeWith(user.value, await useApi().users().get(id));
      title.value = user.value.data.fullName;
    }

    loading.value = false;
  }

  return {
    users,
    user,
    save,
    form,
    loading,
    singularType,
    password,
    passwordRepeat,
    list,
    title,
  };
});
