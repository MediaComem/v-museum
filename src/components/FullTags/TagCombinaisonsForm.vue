<template>
    <div class="canvas-display overflow canvas-display-bottom" :style="canvasHeight" v-if="imagesWithTags.length > 0">
        <div class="clickable-tags-list">
            <div v-for="(tag, index) in selected_tags_with_images" :key="index" class="tag-item">
                <div v-if="!getTags.map((tag) => tag.toLowerCase()).includes(tag.tag.toLowerCase())" class="display-element clickable clickable-tag"
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
    </div>
</template>

<script>
import images from '@/assets/data/images.json';
import tags from "@/assets/onboarding/tags.json";
import { mapState, mapActions } from "pinia";
import store from '../../store';

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
        getTags: {
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
            if (!this.getTags.includes(tag)) {
                this.insertTag(tag)
            }
        },
        removeTag(tag) {
            const index = this.getTags.findIndex((t) => t.toLowerCase() === tag.toLowerCase());
            this.removeTag(index);
        },
        updateTag() {
            this.setImages(this.imagesWithTags)
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
            this.setImagesWithNbTags(this.selected_tags_with_images)
        },
        ...mapActions(store, ["setImagesWithNbTags", "insertTag", "removeTag", "setImages"]),
    },
    computed: {
        fontSize() {
            return {
                "desktop-font": !this.isMobile,
                "mobile-font": this.isMobile,
            };
        },
        canvasHeight() {
            return {
                height: `calc(${screen.availHeight}px - ${this.isIpad ? '102px' : '79px'} - 10vh - ${this.showCarousel ? '35vh' : '80px'})`,
            }
        },
        imagesWithTags() {
            //If user didnt add any tag, basic images are returned and all tags are kept
            if (this.getTags.length == 1) {
                const formated_tags = {}
                this.tags.tags.forEach(tag => {
                    formated_tags[tag.tag.toLowerCase()] = {
                        nb_images: tag.totalImage
                    }
                })
                this.sortInTwoArrays(formated_tags, this.getTags[0].toLowerCase())
                return this.images
            }
            const tags_without_input = {}
            const realTags = this.getTags.slice(1);
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
            this.sortInTwoArrays(tags_without_input, this.getTags[0].toLowerCase())
            return images_with_tags
        },
        ...mapState(store, ["getTags"]),
    }
 
}
</script>

<style scoped>
.canvas-display {
    width: 96vw;
    display: inline-flex;
    padding-left: 2vw;
    padding-right: 2vw;
    justify-content: center;
    align-items: center;
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

.clickable-tags-list {
    display: flex;
    align-content: flex-start;
    padding: 2.25vh 0 2.25vh 2vw;
    max-width: 1000px; 
    height: inherit;
    flex-wrap: wrap;
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

.tag-item:last-child {
    padding-bottom: 200px;
}
</style>