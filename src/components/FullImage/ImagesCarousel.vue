<template>
    <div class="images-preview-carousel">
        <div class="docs-and-button">
            <span class="nb-docs">{{ images.length }} documents</span>
            <!-- Button for full screen -->
            <svg @click="$emit('showFullTagPage')" class="full-screen-button" width="47" height="47" viewBox="0 0 47 47"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.71429 30.2143H0V47H16.7857V40.2857H6.71429V30.2143ZM0 16.7857H6.71429V6.71429H16.7857V0H0V16.7857ZM40.2857 40.2857H30.2143V47H47V30.2143H40.2857V40.2857ZM30.2143 0V6.71429H40.2857V16.7857H47V0H30.2143Z"
                    fill="white" />
            </svg>
        </div>
        <div class="images-arrows-wrapper">
            <!-- previous image arrow-->
            <svg v-if="showLeftArrow" @click="showPreviousImage()" width="15" height="25" viewBox="0 0 15 25"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
                    fill="white" />
            </svg>
            <svg v-if="!showLeftArrow" width="15" height="25" viewBox="0 0 15 25" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
                    fill="#A9A9A9" />
            </svg>
            <!-- Images -->
            <div v-for="index in this.images_index_to_display" :key="index">
                <img class="image-carousel-size" :src="images[index].url" />
            </div>
            <!-- next image arrow-->
            <svg v-if="showRightArrow" @click="showNextImage()" width="15" height="25" viewBox="0 0 15 25" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
                    fill="white" />
            </svg>
            <svg v-if="!showRightArrow" width="15" height="25" viewBox="0 0 15 25" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
                    fill="#A9A9A9" />
            </svg>

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
    props: {
        isMobile: Boolean
    },
    emits: ["showFullTagPage"],
    data() {
        return {
            images_index_to_display: [0, 1]
        }
    },
    methods: {
        showPreviousImage() {
            for (let i = 0; i < this.images_index_to_display.length; i++) {
                this.images_index_to_display[i] -= 1
            }
        },
        showNextImage() {
            for (let i = 0; i < this.images_index_to_display.length; i++) {
                this.images_index_to_display[i] += 1
            }
        },
    },
    computed: {
        showLeftArrow() {
            if (this.images_index_to_display[0] > 0) {
                return true
            }
            return false
        },
        showRightArrow() {
            if (this.images_index_to_display[this.images_index_to_display.length - 1] < this.images.length - 1) {
                return true
            }
            return false
        },
                //Create array representing number of images to display
        baseImagesIndexToDisplay() {
            let max_images_number = this.images.length
            if (this.isMobile) {
                if (max_images_number > 3) {
                    max_images_number = 3
                } 
            } else {
                if(max_images_number > 6) {
                    max_images_number = 6
                }
            }
            const arr = []
            let i = 0
            do {
                arr.push(i)
                i++
            } while (i < max_images_number)
            console.log("base arr", arr)
            return arr
        },
        ...mapGetters({
            images: "getImages"
        })
    },
}
</script>
<style scoped>
:root {
    --disable-grey: #A9A9A9;
}


.images-preview-carousel {
    display: flex;
    position: relative;
    flex-direction: column;
    background-color: black;
    height: 24.7vh;
    width: 100vw;
    z-index: 1;
    margin: 1.63vh 0 0 0;
    justify-content: center;
    align-items: center;
}

.docs-and-button {
    display: flex;
    position: absolute;
    top: 2.65%;
    justify-content: space-between;
    width: 97.35%;
    color: var(--disable-grey);
}

.images-arrows-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.image-carousel-size {
    height: 18.8vh;
    margin-left: 3.83vw;
    margin-right: 2.83vw;
}

.full-screen-button {
    clear: none;
}

.nb-docs {
    color: white;
}
</style>