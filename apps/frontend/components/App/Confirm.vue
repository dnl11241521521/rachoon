<script setup lang="ts">
const result = ref(false);
</script>

<template>
  <dialog :ref="(el) => (useApp().confirmModal = el)" class="modal">
    <div class="modal-box text-center">
      <FaIcon icon="fa-solid fa-triangle-exclamation" class="text-warning text-3xl mx-auto mb-4" />
      <div>{{ useApp().confirmQuesion || "Do you really want to perform this operation?" }}</div>
      <div class="divider"></div>
      <form method="dialog" class="text-center">
        <button class="btn btn-sm btn-neutral" @click="useApp().confirmResult = true">YES</button>
      </form>
    </div>
  </dialog>
</template>
