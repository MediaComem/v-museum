<script>
export default {
  props: {
    header: String,
    length: Number,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    openColor() {
      return {
        color: this.open ? '#808080' : 'black',
      };
    },
  },
};
</script>

<template>
  <div>
    <div class="title">
      <p style="margin-right: 5px" class="text" @click="open = !open" :style="openColor">{{ header }}</p>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ rotate: !open }"
        @click="open = !open"
      >
        <g clip-path="url(#clip0_3203_9601)">
          <path d="M1 4L6 9.5L11 4" :stroke="this.open ? '#808080' : 'black'" />
        </g>
        <defs>
          <clipPath id="clip0_3203_9601">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>

    <div
      data-role="accordeon"
      class="transition"
      :style="{ 'max-height': open ? `${length * 450}px` : '0' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@import './menu.css';

[data-role='accordeon'] {
  width: 100%;
  overflow: hidden;
  display: block;
}

.title {
  width: 100%;
  display: flex;
  padding-left: 0;
  margin: 1rem 1rem 0rem 0rem;
  padding-bottom: 0.9rem;
  cursor: pointer;
}

.icon-font {
  font-size: 20px;
}

.icon-margin {
  margin: 0px;
  padding-right: 0px;
  margin-top: -4px;
}

.transition {
  transition: all 0.25s ease;
}

.rotate {
  transform: rotate(-90deg);
}
</style>
