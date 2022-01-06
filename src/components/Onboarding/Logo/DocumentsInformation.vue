<template>
  <svg
    width="240"
    height="69"
    viewBox="0 0 240 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    @click="$emit('loadTagView', tagInfos)"
  >
    <rect width="240" height="69" rx="34.5" fill="black" />
    <text
      class="text-completion"
      x="30"
      y="30"
      font-size="14"
    >
      {{ tagInfos.tag }}
    </text>
    <text
      class="text-completion"
      x="30"
      y="50"
      font-size="14"
    >
      {{ tagInfos.totalImage }} Documents
    </text>
    <path d="M208.75 43.3205L223.75 34.6603L208.75 26" stroke="white" />
  </svg>
</template>

<script>
export default {
  emits: ["loadTagView"],
  props: {
    tagInfos: Object,
  },
};
</script>

<style scoped>
.text-completion {
  font-weight: normal;
  fill: lightgray;
}
</style>
