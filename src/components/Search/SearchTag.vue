<template>
  <div
    class="transition"
    :class="{ 'search-layout': !isMobile, 'search-layout-mobile': isMobile }"
    :style="{right: isMobile ? isDisplay ? '0vw' : '-100vw' : isDisplay ? '0px' : '-375px'}"
    @keyup.down="nextIndex"
    @keyup.up="previousIndex"
  >
    <div class="header">
      <img
        class="clickable"
        src="@/assets/shared/cross.svg"
        alt="cross"
        @click="$emit('close')"
      />
      <input
        ref="searchInput"
        type="text"
        placeholder="Search"
        v-model="currentInput"
        @input="updateSearchTag"
        @keyup.enter="addTag()"
      />
    </div>
    <div ref="displayTags" class="display-tags">
      <div v-for="(element, index) in availableTags" :key="index">
        <div
          class="tag-element" 
          @click="addTag(element.tag)" 
          @mouseover="currentIndex = index"
        >
          <p class="tag-name" :style="{'background-color': currentInput.toLowerCase() === element.tag.toLowerCase() ? 'rgb(0,0,0,0.2)' : currentIndex === index ? 'rgb(0,0,0,0.2)' : 'white'}">{{ element.tag }}</p> 
          <p class="tag-number" :style="{'background-color': currentInput.toLowerCase() === element.tag.toLowerCase() ? 'rgb(0,0,0,0.2)' : currentIndex === index ? 'rgb(0,0,0,0.2)' : 'white'}">{{ element.nb_images }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import store from '../../store';

import { useWindowSize } from 'vue-window-size';

export default {
  props: {
    isMobile: Boolean,
    isDisplay: Boolean,
  },
  emits: ['close'],
  watch: {
    isDisplay: function(newVal) {
      if (newVal) {
        this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
        this.$refs.searchInput.focus();
      }
    },
    windowHeight: function(newVal) {
      this.maxElementDisplay(newVal);
    },
  },
  data() {
    return {
      timeout_for_user_input_speed_balance: undefined,
      currentInput: '',
      currentIndex: 0,
      availableTags: [],
      windowHeight: 0,
      currentMinIndex: 0,
      currentMaxIndex: 0,
    };
  },
  computed: {
    ...mapState(store, ['getImagesWithNbTags', 'getTags']),
  },
  methods: {
    addTag() {
      const tag = this.availableTags[this.currentIndex];
      if (tag) {
        this.insertTag(tag.tag);
        this.currentInput = '';
        this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
        this.$emit('close');
      }
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
        this.currentIndex = 0;
        this.currentMaxIndex = this.currentMaxIndex - this.currentMinIndex;
        this.currentMinIndex = 0;
        this.$refs.displayTags.scrollTop = 0;
      }, 250);
    },
    nextIndex() {
      if (this.currentIndex < this.availableTags.length - 1 ) {
        this.currentIndex = this.currentIndex + 1;
        if (this.currentIndex > this.currentMaxIndex) {
          this.$refs.displayTags.scrollTop = this.$refs.displayTags.scrollTop + 69.5;
          this.currentMinIndex += 1;
          this.currentMaxIndex += 1;
        }
        
      } 
    },
    previousIndex() {
      if (this.currentIndex > 0 ) {
        this.currentIndex = this.currentIndex - 1;
        if (this.currentIndex < this.currentMinIndex) {
          this.$refs.displayTags.scrollTop = this.$refs.displayTags.scrollTop - 69.5;
          this.currentMinIndex -= 1;
          this.currentMaxIndex -= 1;
        }
      }
    },
    maxElementDisplay(height) {
      this.currentMaxIndex = Math.floor((height - 47) / 69) - 1
    },
    ...mapActions(store, ['insertTag']),
  },
  mounted() {
    const { height } = useWindowSize();
    this.windowHeight = height;
    this.maxElementDisplay(this.windowHeight);
    this.availableTags = this.getImagesWithNbTags.filter((tag) => !this.getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase()));
  },
};
</script>

<style scoped>
@import '../shared/pointer.css';

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
