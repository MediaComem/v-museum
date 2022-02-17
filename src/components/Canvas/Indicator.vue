<template>
  <div class="display">
    <p class="text">{{ tag }}</p>
    <img src="@/assets/canvas/40168.svg" alt="arrow" class="arrow-size" />
  </div>
</template>

<script>
export default {
  props: {
    tag: String,
  },
};
</script>

<style scoped>
.display {
    user-select: none;
    display: flex;
    align-items: center;
}

.arrow-size {
  height: 20px;
  width: 20px;
}

.text {
  transform: rotate(90deg);
  margin: 0;
  width: 50px;
}
</style>
