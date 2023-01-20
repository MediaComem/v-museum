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
      class="next-arrow"
      d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
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
