<template>
  <svg
    class="button-svg"
    @mouseover="arrowColor = '#616161'"
    @mouseleave="arrowColor = '#FFFFFF'"
    width="15"
    height="25"
    viewBox="0 0 15 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="previous-arrow"
      d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
      :fill="arrowColor"
    />
  </svg>
</template>

<script>
export default {
  data() {
    return {
      arrowColor: '#FFFFFF',
    };
  },
};
</script>
