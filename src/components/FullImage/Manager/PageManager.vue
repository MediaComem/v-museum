<template>
  <div
    style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
  >
    <img
      class="clickable"
      src="@/assets/shared/cross.svg"
      @click="backToCanvasView()"
      style="width: 30px; height: 29px"
    />
  </div>
  <div
    style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
  >
    <infos class="clickable" @click="$emit('changeDisplay')" :display="display" />
  </div>
</template>

<script>
import Infos from "./Infos.vue";
export default {
  components: { Infos },
  emits: ["backToCanvasView", "changeDisplay"],
  props: {
    display: Boolean,
    from: Object,
  },
  methods: {
      backToCanvasView() {
      this.$router.push({
        path: `${this.from.fullPath}`,
      });
    },
  } 
};
</script>

<style scoped>
@import '../../shared/pointer.css';
</style>
