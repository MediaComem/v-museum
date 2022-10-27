<template>
    <div class="images-preview-carousel">
        <div class="docs-and-button">
            <span :class="`${fontSize} nb-docs`" v-if="images.length > 1">{{ images.length }} <br v-if="this.isMobile">
                documents</span>
            <span v-else :class="`${fontSize} nb-docs`">{{ images.length }} document</span>
            <!-- Button for full screen -->
            <svg class="button-svg full-screen-button" @click="$emit('showFullTagPage')"
                @mouseover="changeButtonColor(true, '.full-screen-path')"
                @mouseleave="changeButtonColor(false, '.full-screen-path')" width="47" height="47" viewBox="0 0 47 47"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="full-screen-path"
                    d="M6.71429 30.2143H0V47H16.7857V40.2857H6.71429V30.2143ZM0 16.7857H6.71429V6.71429H16.7857V0H0V16.7857ZM40.2857 40.2857H30.2143V47H47V30.2143H40.2857V40.2857ZM30.2143 0V6.71429H40.2857V16.7857H47V0H30.2143Z"
                    fill="white" />
            </svg>
        </div>
        <div class="images-arrows-wrapper">
            <!-- previous image arrow-->
            <svg class="button-svg" v-if="showLeftArrow" @click="showPreviousImage()"
                @mouseover="changeButtonColor(true, '.previous-arrow')"
                @mouseleave="changeButtonColor(false, '.previous-arrow')" width="15" height="25" viewBox="0 0 15 25"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="previous-arrow"
                    d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
                    fill="white" />
            </svg>
            <!-- Images -->
            <div class="image-wrapper" v-for="index in this.images_index_to_display" :key="index">
                <img class="image-carousel-size" :src="images[index].url" @click="loadImage(images[index].id)"/>
            </div>
            <!-- next image arrow-->
            <svg class="button-svg" v-if="showRightArrow" @click="showNextImage()"
                @mouseover="changeButtonColor(true, '.next-arrow')"
                @mouseleave="changeButtonColor(false, '.next-arrow')" width="15" height="25" viewBox="0 0 15 25"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="next-arrow"
                    d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
                    fill="white" />
            </svg>

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

import dataFetch from "../../api/dataFetching";

export default {
    props: {
        nbImages: Number,
        isMobile: Boolean
    },
    emits: ["showFullTagPage"],
    data() {
        return {
            images_index_to_display: this.baseImagesIndexToDisplay()
        }
    },
    methods: {
        showPreviousImage() {
            this.images_index_to_display = this.images_index_to_display.map(v => v - 1)
        },
        showNextImage() {
           this.images_index_to_display = this.images_index_to_display.map(v => v + 1)
        },
        //Create array representing number of images to display
        baseImagesIndexToDisplay() {
            const client_width = window.innerWidth
            let max_images_number = this.nbImages
            //Mobile
            if (client_width < 436) {
                if (max_images_number > 2) {
                    max_images_number = 2
                }
            //Tablet
            } else if (client_width > 436 && client_width < 1000) {
                if (max_images_number > 4) {
                    max_images_number = 4
                }
            } else if (client_width >= 1000) {
                if (max_images_number > 6) {
                    max_images_number = 6
                }
            }
            return Array.from(Array(max_images_number).keys()) 
        },
        loadImage(imageId) {
            dataFetch.getImageById(imageId).then((data) => {
                if (data.length > 0) {
                    const img_data = data[0];
                    this.$router.push({
                    path: `/image/${imageId}`,
                    query: { image: JSON.stringify(img_data) },
                    });
                }
            });
        },
        changeButtonColor(hover, selector) {
            if (hover) {
                document.querySelector(selector).setAttribute('fill', '#616161')
            } else {
                document.querySelector(selector).setAttribute('fill', '#ffffff')
            }
        }
    },
    computed: {
        fontSize() {
            return {
                "desktop-font": !this.isMobile,
                "mobile-font": this.isMobile,
            };
        },
        showLeftArrow() {
            return this.images_index_to_display[0] > 0
        },
        showRightArrow() {
            return this.images_index_to_display[this.images_index_to_display.length - 1] < this.images.length - 1
        },
        ...mapGetters({
            images: "getImages"
        }),
    },
}
</script>
<style scoped>
.desktop-font {
    font-size: normal;
}

.mobile-font {
    font-size: small;
}

.images-preview-carousel {
    display: flex;
    position: relative;
    flex-direction: column;
    background-color: black;
    height: 20vh;
    width: 100vw;
    z-index: 1;
    justify-content: center;
    align-items: center;
}

.docs-and-button {
    display: flex;
    position: absolute;
    top: 0;
    width: 97.3%;
    margin: 0.75vh 1.35vw;
    justify-content: space-between;
}

.button-svg {
    cursor: pointer;
}

.images-arrows-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.image-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
}

.image-carousel-size {
    cursor: pointer;
    margin: 0 2.83vw 0 3.83vh;
    height: 80%;
}

.full-screen-button {
    clear: none;
}

.nb-docs {
    color: white;
}
</style>