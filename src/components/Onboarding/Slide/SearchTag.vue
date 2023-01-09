<template>
  <div
    class="transition"
    :class="{ 'search-layout': !isMobile, 'search-layout-mobile': isMobile }"
    :style="{right: isMobile ? isDisplay ? '0vw' : '-100vw' : isDisplay ? '0px' : '-375px'}"
  >
    <div class="header">
      <img
        class="clickable"
        src="@/assets/shared/cross.svg"
        alt="cross"
        @click="$emit('close')"
      />
      <input
        type="text"
        placeholder="Search"
        v-model="currentInput"
        @input="updateSearchTag"
        @keyup.enter="addTag(currentInput)"
      />
    </div>
    <div class="display-tags">
      <div v-for="(element, index) in availableTags" :key="index">
        <div class="tag-element" @click="addTag(element.tag)" :style="{'background-color': currentInput.toLowerCase() === element.tag.toLowerCase() ? 'red' : 'white'}">
          <p class="tag-name">{{ element.tag }}</p> 
          <p class="tag-number">{{ element.nb_images }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    isMobile: Boolean,
    isDisplay: Boolean,
  },
  emits: ['close'],
  watch: {
    isDisplay: function(newVal) {
      if (newVal) this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
    },
  },
  data() {
    return {
      timeout_for_user_input_speed_balance: undefined,
      currentInput: '',
      availableTags: [],
    };
  },
  computed: {
    ...mapGetters(['getImagesWithNbTags', 'getTags']),
  },
  methods: {
    addTag(tag) {
      this.$store.dispatch('insertTag', tag);
      this.currentInput = '';
      this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
      this.$emit('close');
    },
    updateSearchTag(event) {
      clearTimeout(this.timeout_for_user_input_speed_balance);
      this.timeout_for_user_input_speed_balance = undefined;
      this.timeout_for_user_input_speed_balance = setTimeout(() => {
        const formated_string =
          event.target.value.charAt(0).toLowerCase() +
          event.target.value.slice(1);
        this.currentInput = formated_string;
        this.availableTags = this.getImagesWithNbTags.filter((tag) =>
          tag.tag.toLowerCase().includes(formated_string) && !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase())
        );

      }, 250);
    },
  },
  mounted() {
    this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
  },
};
</script>

<style scoped>
@import '../../shared/pointer.css';

.transition {
    transition: all 0.3s ease-in-out;
}

.search-layout {
  height: 100vh;
  width: 375px;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 3;
  background-color: white;
}

.search-layout-mobile {
  height: 100vh;
  width: 100vw;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 3;
  background-color: white;
}

.header {
  margin-left: 10px;
  margin-top: 20px;
  display: flex;
}

.header > img {
  width: 24px;
  height: 21px;
}

input {
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  border-radius: 20px;
  height: 21px;
}

.display-tags {
  overflow-y: auto;
  height: 95%;
  margin-left: 20px;
}

.display-tags > div {
    cursor: pointer;
}

.tag-element {
    display: flex;
}

.tag-name {
    width: 80%;
    display: flex;
    align-items: center;
}

.tag-number {
    border: 1px solid black;
    border-radius: 6px;
    padding: 8px;
}
</style>
