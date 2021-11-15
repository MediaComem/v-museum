<template>
  <svg
    width="40"
    height="45"
    viewBox="0 0 40 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="5"
      y="8"
      width="29"
      height="29"
      rx="14.5"
      :fill="display ? 'black' : 'white'"
      stroke="black"
      stroke-width="2"
    />
    <path
      d="M19.1499 28H20.8487V19.2727H19.1499V28ZM20.0078 17.9261C20.593 17.9261 21.0817 17.4716 21.0817 16.9148C21.0817 16.358 20.593 15.8977 20.0078 15.8977C19.4169 15.8977 18.9339 16.358 18.9339 16.9148C18.9339 17.4716 19.4169 17.9261 20.0078 17.9261Z"
      :fill="display ? 'white' : 'black'"
    />
  </svg>
</template>

<script>
export default {
  props: {
    display: Boolean,
  },
};
</script>

<style></style>
