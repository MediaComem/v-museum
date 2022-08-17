<template>
    <form class="tag-selection-form" @submit="prevent">
        <legend>Images with tags form</legend>
        <!-- Quand l'utilisateur entre un tag avec enter, on l'ajoute, qu'il existe ou non. -->
        <input type="text" class="tag-filter-input" placeholder="SEARCH TAG TO FILTER" @focus="show_tags_options = true"
            @input="updateSearchTag($event)" @keyup.enter="this.selected_tags.push(this.selected_tags[0])" />
    </form>

    <div class="documents-for-search-infos">
        <br />
        <span v-for="(tag, index) in this.selected_tags" :key="index">
            <span v-if="index != 0 && index != selected_tags.length - 1">#{{ tag }}, </span>
            <span v-else-if="index == selected_tags.length - 1">#{{ tag }}</span>
            <span v-if="this.selected_tags[0] != ''">, </span>
        </span>
        <span>{{ this.selected_tags[0] }}</span>
        <br />

        <span v-if="this.imagesWithTags.length > 0">{{ this.imagesWithTags.length }} documents</span>
        <span v-else>It seems no document contains the tags combinaison you entered.</span>

        <div class="tags-options" v-if="this.show_tags_options">
            <ul class="tags-options-list">
                <div class="tag-option" 
                v-for="(tag, index) in this.input_and_selected_tags_with_images" :key="index"
                @click="addTag(tag.tag)">
                    <li > {{ tag.tag }} : {{ tag.nb_images }} documents</li>
                </div>
            </ul>
        </div>
    </div>

    <div class="removable-tags">
        <div class="removable-tag" v-for="(tag, index) in confirmed_tags" :key="index">
            <svg class="remove-tag-button" width="15" height="15" viewBox="0 0 15 15" fill="none"
                xmlns="http://www.w3.org/2000/svg" @click="removeTag(index + 1)"
                @mouseover="changeRemoveTagButton(true, index)" @mouseleave="changeRemoveTagButton(false, index)">
                <circle v-if="hovered.has(index)" cx="7" cy="7" r="7" fill="white" />
                <path v-if="hovered.has(index)"
                    d="M4.42708 10.4833L7.08333 7.82708L9.73958 10.4833L10.4833 9.73958L7.82708 7.08333L10.4833 4.42708L9.73958 3.68333L7.08333 6.33958L4.42708 3.68333L3.68333 4.42708L6.33958 7.08333L3.68333 9.73958L4.42708 10.4833ZM7.08333 14.1667C6.11528 14.1667 5.20035 13.9807 4.33854 13.6089C3.47674 13.237 2.72413 12.7293 2.08073 12.0859C1.43733 11.4425 0.929687 10.6899 0.557812 9.82813C0.185937 8.96632 0 8.05139 0 7.08333C0 6.10347 0.185937 5.18264 0.557812 4.32083C0.929687 3.45903 1.43733 2.70938 2.08073 2.07188C2.72413 1.43438 3.47674 0.929687 4.33854 0.557812C5.20035 0.185937 6.11528 0 7.08333 0C8.0632 0 8.98403 0.185937 9.84583 0.557812C10.7076 0.929687 11.4573 1.43438 12.0948 2.07188C12.7323 2.70938 13.237 3.45903 13.6089 4.32083C13.9807 5.18264 14.1667 6.10347 14.1667 7.08333C14.1667 8.05139 13.9807 8.96632 13.6089 9.82813C13.237 10.6899 12.7323 11.4425 12.0948 12.0859C11.4573 12.7293 10.7076 13.237 9.84583 13.6089C8.98403 13.9807 8.0632 14.1667 7.08333 14.1667ZM7.08333 13.1042C8.75972 13.1042 10.1823 12.5168 11.351 11.3422C12.5198 10.1675 13.1042 8.74792 13.1042 7.08333C13.1042 5.40695 12.5198 3.98438 11.351 2.81563C10.1823 1.64688 8.75972 1.0625 7.08333 1.0625C5.41875 1.0625 3.99913 1.64688 2.82448 2.81563C1.64983 3.98438 1.0625 5.40695 1.0625 7.08333C1.0625 8.74792 1.64983 10.1675 2.82448 11.3422C3.99913 12.5168 5.41875 13.1042 7.08333 13.1042Z"
                    fill="#616161" />
                <path v-if="!hovered.has(index)"
                    d="M4.42708 10.4833L7.08333 7.82708L9.73958 10.4833L10.4833 9.73958L7.82708 7.08333L10.4833 4.42708L9.73958 3.68333L7.08333 6.33958L4.42708 3.68333L3.68333 4.42708L6.33958 7.08333L3.68333 9.73958L4.42708 10.4833ZM7.08333 14.1667C6.11528 14.1667 5.20035 13.9807 4.33854 13.6089C3.47674 13.237 2.72413 12.7293 2.08073 12.0859C1.43733 11.4425 0.929687 10.6899 0.557812 9.82813C0.185937 8.96632 0 8.05139 0 7.08333C0 6.10347 0.185937 5.18264 0.557812 4.32083C0.929687 3.45903 1.43733 2.70938 2.08073 2.07188C2.72413 1.43438 3.47674 0.929687 4.33854 0.557812C5.20035 0.185937 6.11528 0 7.08333 0C8.0632 0 8.98403 0.185937 9.84583 0.557812C10.7076 0.929687 11.4573 1.43438 12.0948 2.07188C12.7323 2.70938 13.237 3.45903 13.6089 4.32083C13.9807 5.18264 14.1667 6.10347 14.1667 7.08333C14.1667 8.05139 13.9807 8.96632 13.6089 9.82813C13.237 10.6899 12.7323 11.4425 12.0948 12.0859C11.4573 12.7293 10.7076 13.237 9.84583 13.6089C8.98403 13.9807 8.0632 14.1667 7.08333 14.1667ZM7.08333 13.1042C8.75972 13.1042 10.1823 12.5168 11.351 11.3422C12.5198 10.1675 13.1042 8.74792 13.1042 7.08333C13.1042 5.40695 12.5198 3.98438 11.351 2.81563C10.1823 1.64688 8.75972 1.0625 7.08333 1.0625C5.41875 1.0625 3.99913 1.64688 2.82448 2.81563C1.64983 3.98438 1.0625 5.40695 1.0625 7.08333C1.0625 8.74792 1.64983 10.1675 2.82448 11.3422C3.99913 12.5168 5.41875 13.1042 7.08333 13.1042Z"
                    fill="white" />
            </svg>
            <span class="removable-tag-text">{{ tag }}</span>
        </div>
    </div>

    <div ref="tags_to_display" class="canvas-display overflow tags-list" @scroll="scrollMove"
        @touchend="changeSlideScroll" @mousewheel="wheelMoveScroll">
        <div v-for="(tag, index) in this.selected_tags_with_images" :key="index" class="border">
            <div class="display-element clickable" @click="addTag(tag.tag)">
                <!-- <div class="display-element clickable" @click="addTag(tag.tag)" @click="$emit('loadTagView', tag)"> -->
                <p :class="fontSize" @mouseover="this.show_carousel = true">{{ tag.tag.charAt(0).toUpperCase() +
                        tag.tag.slice(1)
                }} • {{ tag.nb_images }}</p>
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
    },
    data() {
        return {
            images: images,
            selected_tags_with_images: {},
            input_and_selected_tags_with_images: {},
            tags: tags,
            show_tags_options: false,
            last_user_input: Date.now(),
            mytimeout: undefined,
            hovered: new Set()
        }
    },
    methods: {
        updateSearchTag(event) {
            clearTimeout(this.mytimeout);
            this.mytimeout = undefined;
            this.mytimeout = setTimeout(() => {
                const formated_string = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
                this.selected_tags[0] = (formated_string);
            }, 250);
            //Add little interval, so if user writes fast, there is no problem
        },
        addTag(tag) {
            if (!this.selected_tags.includes(tag)) {
                this.$store.dispatch('insertTag', tag)
                // this.selected_tags.push(tag)
                this.$store.dispatch('setImages', this.imagesWithTags)
                console.log(this.im_2)
                const data_to_return = {
                    selected_tags: this.confirmed_tags,
                    images: this.imagesWithTags,
                    tags_list: this.selected_tags_with_images,
                    input_filter_tags_list: this.input_and_selected_tags_with_images
                }
                document.querySelector('.tag-filter-input').value = ''
                // console.log('passé en emit:', data_to_return)
                this.$emit('updateTagsList', data_to_return)
            }
        },
        removeTag(index) {
            console.log("supression", this.selected_tags)
            // this.selected_tags.splice(index, 1)
            // console.log("suprimé", this.selected_tags)
            this.$store.dispatch('removeTag', index);
            console.log("suprimé 2", this.selected_tags)

            this.$store.dispatch('setImages', this.imagesWithTags)

            const data_to_return = {
                selected_tags: this.confirmed_tags,
                images: this.imagesWithTags,
                tags_list: this.selected_tags_with_images,
                input_filter_tags_list: this.input_and_selected_tags_with_images
            }
            this.$emit('updateTagsList', data_to_return)
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
                if (tag.includes(substr)) {
                    tags_with_substr_arr.push(tag_obj)
                }
            })
            all_tags_arr.sort((a, b) => a.tag.localeCompare(b.tag))
            tags_with_substr_arr.sort((a, b) => a.tag.localeCompare(b.tag))
            this.selected_tags_with_images = all_tags_arr,
                this.input_and_selected_tags_with_images = tags_with_substr_arr
        },
        changeRemoveTagButton(hover, index) {
            if (hover) {
                this.hovered.add(index)
            } else {
                this.hovered.delete(index)
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
            //Get only images including all selected tags except first (user current input) in array of selected tags
            const images_with_tags = this.images.filter((im) => {
                let ok = true
                let i = 1;
                //Check all selected tags except first (user current input) if in image tags
                do {
                    //Management of case sensitivity for UX
                    const img_lower_case_tags = []
                    im.tags.forEach(tg => {
                        img_lower_case_tags.push(tg.toLowerCase())
                    })
                    // ensure current tag is in image tags
                    if (img_lower_case_tags.includes(this.selected_tags[i].toLowerCase())) {
                        img_lower_case_tags.forEach(img_tag => {
                            //Ensure all  confirmed selected tags are into the image tags before adding this image to the concerned tags possibilities.
                            if (i == this.selected_tags.length - 1) {
                                // Case 1, this tag was already in a image to keep
                                if (tags_without_input[img_tag]) {
                                    tags_without_input[img_tag].nb_images += 1
                                }
                                // Case 2, no image parcoured had the tag to add yet
                                else if (!tags_without_input[img_tag]) {
                                    tags_without_input[img_tag] = { nb_images: 1 }
                                }
                            }
                        })
                    } else {
                        ok = false
                    }
                    i++;
                } while (ok && i < this.selected_tags.length)
                this.selected_tags_with_images = tags_without_input
                return ok
            })
            this.sortInTwoArrays(this.selected_tags_with_images, this.selected_tags[0].toLowerCase())
            // console.log("LES IMAGES:", this.selected_tags_with_images, "Les images + input:", this.input_and_selected_tags_with_images, "input: ", this.selected_tags[0])
            return images_with_tags
        },
        confirmed_tags() {
            const formated_selected_tags = []
            for (let i = 1; i < this.selected_tags.length; i++) {
                formated_selected_tags.push(this.selected_tags[i])
            }
            return formated_selected_tags
        },
        ...mapGetters({
            selected_tags: "getTags",
            im_2: "getImages"
        }),
    }
}
</script>

<style>
.canvas-display {
    display: inline-flex;
    flex-wrap: wrap;
    width: 96vw;
    height: 90vh;
    padding-left: 2vw;
    padding-right: 2vw;
    justify-content: flex-start;
    align-items: center;
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
    font-size: x-small;
}

.tag-selection-form {
    margin: 0 0 0 10px;
}

.tag-filter-input {
    margin: 5px 0 0 0;
    z-index: 8;
}

.tags-options {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 16px 0;
    top: 15%;
    z-index: 7;
    background-color: white;
    border-radius: 10px;
    border: 1px solid rgb(44, 62, 80);
    max-height: 25vh;
}

.tags-options-list {
    max-width: 40vw;
    display: flex;
    max-height: 22vh;
    flex-wrap: wrap;
    overflow: hidden;
    overflow-y:scroll;
    list-style-type: none;
    margin: 0 0 0 0;
}

.tag-option {
    height: 5vw;
    width: 100%;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
}

.tag-option:hover {
    background-color: #616161;
}

.tag-option:hover li{
    color: white;
}

.documents-for-search-infos {
    margin: 0 0 0 10px;
}

.removable-tags {
    display: flex;
    padding: 0 0 10px 0;
    margin: 10px;
    border-bottom: 1px solid rgb(44, 62, 80);
}

.remove-tag-button {
    margin: 0 10px 0 0;
    cursor: pointer;
}

.removable-tag-text {
    margin: 0 5px 0 0;
}

.removable-tag {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 30px;
    margin: 15px 15px 0 0;
    padding: 10px;
    background-color: #616161;
    color: white;
}

.tags-list {
    height: 51vh;
}

.border {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: solid 1px rgb(44, 62, 80);
    border-radius: 30px;
    margin: 15px 15px 0 0;
    text-align: center;
}

.border:hover {
    background-color: #616161;
    color: white;
    border: 1px solid white;
}
</style>