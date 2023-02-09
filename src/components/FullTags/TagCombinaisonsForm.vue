<template>
    <div class="canvas-display overflow clickable-tags-list" :class="canvasDisplay" v-if="imagesWithTags.length > 0">
        <div v-for="(tag, index) in selected_tags_with_images" :key="index">
            <div v-if="!selected_tags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase())" class="display-element clickable clickable-tag"
                @click="addTag(tag.tag)">
                <span :class="fontSize">{{ tag.tag.charAt(0).toUpperCase() +
                        tag.tag.slice(1)
                }} • {{ tag.nb_images }}</span>
            </div>
            <div v-else class="display-element clickable disabled-tag" @click="removeTag(tag.tag)">
                <span :class="fontSize">{{ tag.tag.charAt(0).toUpperCase() +
                        tag.tag.slice(1)
                }} • {{ tag.nb_images }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import images from '@/assets/data/images.json';
import tags from "@/assets/onboarding/tags.json";
import { mapGetters } from "vuex";

export default {
    emits: ["updateTagsList"],
    props: {
        isMobile: Boolean,
        showCarousel: Boolean,
    },
    data() {
        return {
            images: images,
            selected_tags_with_images: {},
            input_and_selected_tags_with_images: {},
            tags: tags,
            show_tags_options: false,
            timeout_for_user_input_speed_balance: undefined,
            hovered_removable_tags: new Set(),
            selected_tags_index: new Set(),
        }
    },
    watch: {
        selected_tags: {
            handler() {
                this.updateTag();
            },
            deep: true,
        }
    },
    methods: {
        addTag(tag) {
            if (tag.includes("/")) {
                tag = tag.replace('/', '')
            }
            if (!this.selected_tags.includes(tag)) {
                this.$store.dispatch('insertTag', tag)
            }
        },
        removeTag(tag) {
            const index = this.selected_tags.findIndex((t) => t.toLowerCase() === tag.toLowerCase());
            this.$store.dispatch('removeTag', index);
        },
        updateTag() {
            this.$store.dispatch('setImages', this.imagesWithTags)
            this.$emit('updateTagsList', this.imagesWithTags)
        },
        sortInTwoArrays(data_obj, substr) {
            const keys = Object.keys(data_obj)
            const all_tags_arr = []
            const tags_with_substr_arr = []
            keys.forEach(tag => {
                const tag_obj = {
                    tag: tag,
                    nb_images: data_obj[tag].nb_images
                }
                all_tags_arr.push(tag_obj)
                if (tag.toLowerCase().includes(substr)) {
                    tags_with_substr_arr.push(tag_obj)
                }
            })
            all_tags_arr.sort((a, b) => a.tag.localeCompare(b.tag))
            tags_with_substr_arr.sort((a, b) => a.tag.localeCompare(b.tag))
            this.selected_tags_with_images = all_tags_arr;
            this.input_and_selected_tags_with_images = tags_with_substr_arr;
            this.$store.dispatch('setImagesWithNbTags', this.selected_tags_with_images)
        },
    },
    computed: {
        fontSize() {
            return {
                "desktop-font": !this.isMobile,
                "mobile-font": this.isMobile,
            };
        },
        canvasDisplay() {
            return {
                'canvas-with-carousel': this.showCarousel && !this.isMobileDevice,
                'canvas-display-mobile': !this.showCarousel && this.isMobileDevice && !this.isSafariBrowser && !this.isFirefoxBrowser,
                'canvas-display-mobile-firefox': !this.showCarousel && this.isMobileDevice && this.isFirefoxBrowser,
                'canvas-display-mobile-safari': !this.showCarousel && this.isMobileDevice && this.isSafariBrowser,
                'canvas-with-carousel-mobile': this.showCarousel && this.isMobileDevice,
            }
        },
        imagesWithTags() {
            //If user didnt add any tag, basic images are returned and all tags are kept
            if (this.selected_tags.length == 1) {
                const formated_tags = {}
                this.tags.tags.forEach(tag => {
                    formated_tags[tag.tag.toLowerCase()] = {
                        nb_images: tag.totalImage
                    }
                })
                this.sortInTwoArrays(formated_tags, this.selected_tags[0].toLowerCase())
                return this.images
            }
            const tags_without_input = {}
            const realTags = this.selected_tags.slice(1);
            //Get only images including all selected tags except first (user current input) in array of selected tags
            const images_with_tags = this.images.filter((im) => {
                if (realTags.every((tag) => {
                    return im.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
                })) {
                    im.tags.forEach((tag) => {
                        if (tags_without_input[tag]) {
                            tags_without_input[tag].nb_images += 1
                        } else {
                            tags_without_input[tag] = { nb_images: 1 }
                        }
                    })
                    return true
                }
            });
            this.sortInTwoArrays(tags_without_input, this.selected_tags[0].toLowerCase())
            return images_with_tags
        },
        ...mapGetters({
            selected_tags: "getTags",
        }),
    }
}
</script>

<style scoped>
.canvas-display {
    display: inline-flex;
    flex-wrap: wrap;
    padding-left: 2vw;
    padding-right: 2vw;
    justify-content: flex-start;
    align-items: center;
    max-width: 1000px;
    margin: auto;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
    .display-element {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 10px;
        display: flex;
    }
}

@media only screen and (min-width: 437px) and (max-width: 999px) {
    .display-element {
        display: flex;
        justify-content: left;
        align-items: center;
        margin: 0 15px;
    }
}

@media only screen and (min-width: 800px) {
    .display-element {
        display: flex;
        justify-content: left;
        align-items: center;
        margin: 0 20px;
    }
}

.desktop-font {
    font-size: normal;
}

.mobile-font {
    font-size: small;
}


@media screen and (min-width: 750px) {
    .canvas-display {
        height: calc(85.5vh - 80px);
    }

    .canvas-display-mobile {
        height: calc(71.5vh - 80px);
    }

    .canvas-display-mobile-firefox {
        height: calc(77.5vh - 80px);
    }

    .canvas-display-mobile-safari {
        height: calc(75.5vh - 80px);
    }

    .canvas-with-carousel {
        height: 50.5vh;
    }

    .canvas-with-carousel-mobile {
        height: 42.3vh;
    }
}

@media screen and (max-width: 750px) {
    .canvas-display {
        height: calc(79.3vh - 80px);
    }

    .canvas-display-mobile {
        height: calc(79.3vh - 80px);
    }

    .canvas-display-mobile-firefox {
        height: calc(79.3vh - 80px);
    }

    .canvas-display-mobile-safari {
        height: calc(79.3vh - 80px);
    }

    .canvas-with-carousel {
        height: 45.6vh;
    }

    .canvas-with-carousel-mobile {
        height: 45.6vh;
    }
}

.clickable-tags-list {
    display: flex;
    align-content: flex-start;
    padding: 2.25vh 0 2.25vh 2vw;
}

.clickable-tag {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: solid 1px rgb(44, 62, 80);
    border-radius: 6px;
    margin: 15px 15px 0 0;
    padding: 8px;
    text-align: center;
}

.disabled-tag {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #A9A9A9;
    color: white;
    border-radius: 6px;
    margin: 15px 15px 0 0;
    padding: 8px;
    text-align: center;
}

@media (hover: hover) {
    .clickable-tag:hover {
        background-color: #616161;
        color: white;
        border: 1px solid white;
    }
}
</style>