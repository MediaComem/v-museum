<template>
  <div
    style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
  >
    <img
      src="@/assets/shared/cross.svg"
      @click="$emit('backToCanvasView')"
      style="width: 30px; height: 29px"
    />
  </div>
  <div
    style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
  >
    <infos @click="$emit('changeDisplay')" :display="display" />
  </div>
</template>

<script>
import Infos from "./Infos.vue";
export default {
  components: { Infos },
  emits: ["backToCanvasView", "changeDisplay"],
  props: {
    display: Boolean,
  },
};
</script>

<style></style>
