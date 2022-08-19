<template>
    <div class="form-and-tag-options">
        <form class="tag-selection-form" @submit="prevent">
            <!-- Loupe -->
            <svg class="loupe" width="14" height="14" viewBox="0 0 14 14" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.925 13.7312L7.99375 8.79995C7.61875 9.12495 7.18125 9.37808 6.68125 9.55933C6.18125 9.74058 5.65 9.8312 5.0875 9.8312C3.7375 9.8312 2.59375 9.36245 1.65625 8.42495C0.71875 7.48745 0.25 6.3562 0.25 5.0312C0.25 3.7062 0.71875 2.57495 1.65625 1.63745C2.59375 0.699951 3.73125 0.231201 5.06875 0.231201C6.39375 0.231201 7.52187 0.699951 8.45312 1.63745C9.38437 2.57495 9.85 3.7062 9.85 5.0312C9.85 5.5687 9.7625 6.08745 9.5875 6.58745C9.4125 7.08745 9.15 7.5562 8.8 7.9937L13.75 12.9062L12.925 13.7312ZM5.06875 8.7062C6.08125 8.7062 6.94375 8.34683 7.65625 7.62808C8.36875 6.90933 8.725 6.0437 8.725 5.0312C8.725 4.0187 8.36875 3.15308 7.65625 2.43433C6.94375 1.71558 6.08125 1.3562 5.06875 1.3562C4.04375 1.3562 3.17188 1.71558 2.45312 2.43433C1.73438 3.15308 1.375 4.0187 1.375 5.0312C1.375 6.0437 1.73438 6.90933 2.45312 7.62808C3.17188 8.34683 4.04375 8.7062 5.06875 8.7062Z"
                    fill="#2C3E50" />
            </svg>

            <input type="text" class="tag-filter-input" placeholder="SEARCH TAG TO FILTER"
                @focus="handleTagOptionsDisplay(true)" @input="updateSearchTag($event)"
                @blur="handleTagOptionsDisplay(false)" @keyup.enter="this.selected_tags.push(this.selected_tags[0])" />
        </form>

        <!-- Selected tags -->
        <div class="tags-options" v-if="this.show_tags_options">
            <ul class="tags-options-list">
                <div v-if="this.selected_tags.length > 1" class="selected-tags-in-options-list-wrapper">
                    <div v-for="(tag, index) in this.selected_tags" :key="index">
                        <div class="selected-tag-in-option-list" v-if="index > 0">
                            <li class="selected-tag-in-option-text">
                                <span class="selected-tag-in-option-span"><b> #{{ tag.charAt(0).toUpperCase() +
                                        tag.slice(1)
                                }}</b></span>
                                <span class="selected-tag-in-option-span"><b>{{ this.imagesWithTags.length }}</b></span>
                            </li>
                        </div>
                    </div>
                </div>

                <!-- Other possible tags -->
                <template v-for="(tag, index) in this.input_and_selected_tags_with_images" :key="index">
                    <div v-if="!this.selected_tags.includes(tag.tag)"  @click="addTag(tag.tag)" class="tag-option">
                        <li :class="`${fontSize} option-text`"> {{ tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1) }}
                            · {{ tag.nb_images }}</li>
                    </div>
                </template>
            </ul>
        </div>
    </div>

    <!--Hack div to ensure hight of elemnts do not cause problems-->
    <div v-if="this.show_tags_options" style="height: 5.57vh;"></div>

    <div class="documents-for-search-infos">
        <span v-if="this.imagesWithTags.length > 0">{{ this.imagesWithTags.length }} documents</span>
        <span v-else>It seems no document contains the tags combinaison you entered.</span>
    </div>

    <!-- removable tags -->
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
            <span class="removable-tag-text">#{{ tag.charAt(0).toUpperCase() + tag.slice(1) }}</span>
        </div>
    </div>

    <div class="canvas-display overflow clickable-tags-list" @scroll="scrollMove" @touchend="changeSlideScroll"
        @mousewheel="wheelMoveScroll">
        <div v-for="(tag, index) in this.selected_tags_with_images" :key="index">
            <div v-if="!this.selected_tags.includes(tag.tag)" class="display-element clickable clickable-tag" @click="addTag(tag.tag)">
                <span :class="fontSize">{{ tag.tag.charAt(0).toUpperCase() +
                        tag.tag.slice(1)
                }} • {{ tag.nb_images }}</span>
            </div>
            <div v-else class="display-element clickable disabled-tag" @click="addTag(tag.tag)" >
                <p :class="fontSize">{{ tag.tag.charAt(0).toUpperCase() +
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
            hovered: new Set(),
            selected_tags_index: new Set()
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
            if(tag.includes("/")) {
                console.log("includes")
                 tag = tag.replace('/', '')
            }
           

            if (!this.selected_tags.includes(tag)) {
                this.$store.dispatch('insertTag', tag)
                this.$store.dispatch('setImages', this.imagesWithTags)
                const data_to_return = {
                    selected_tags: this.confirmed_tags,
                    images: this.imagesWithTags,
                    tags_list: this.selected_tags_with_images,
                    input_filter_tags_list: this.input_and_selected_tags_with_images
                }
                this.$emit('updateTagsList', data_to_return)
                document.querySelector('.tag-filter-input').value = ''
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
        },
        handleTagOptionsDisplay(show) {
            if (show) {
                document.querySelector('.form-and-tag-options').classList.add('with-options')
                this.show_tags_options = true
                document.querySelector('.documents-for-search-infos').classList.add
            } else {
                //Wait 200ms to avoid the blur preventing the click on the an option tag
                setTimeout(() => {
                    document.querySelector('.form-and-tag-options').classList.remove('with-options')
                    this.show_tags_options = false
                }, 200);
            }
        },
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

    .from-and-tag-options {
        width: 42vw;
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

.form-and-tag-options {
    margin: 0 0 0 2.67vw;
}

.tag-selection-form {
    position: relative;
    margin: 0 0 1.5vh 0;
}

.loupe {
    position: absolute;
    margin: 1.12vh 2.01vw;
}

.tag-filter-input {
    border-radius: 30px;
    border: 0.5px solid rgb(44, 62, 80);
    width: 55vw;
    padding: 0 0 0 6vw;
}

.tag-filter-input:active {
    border: 0.75px solid rgb(44, 62, 80);
}

.tag-filter-input {
    height: 3.9vh;
    z-index: 8;
}

.selected-tags-in-options-list-wrapper {
    width: 100%;
}

.with-options {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 7;
    background-color: #ffffff;
    width: 63.4vw;
    border: 1px solid #2c3e50;
    border-radius: 1.3vw;
    height: 23vh;
}

.tags-options {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 70%;
}

.tags-options-list {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    overflow-y: scroll;
    list-style-type: none;
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    height: 100%;
    width: 100%;
}

.selected-tag-in-option-list {
    height: 5.4vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    color: black;
}

.selected-tag-in-option-text {
    padding: 0 0 0 3.75vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

.selected-tag-in-option-span {
    padding: 0 3.75vw 0 0;
}

.tag-option {
    height: 5.4vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
}

.tag-option:hover {
    background-color: #616161;
}

.tag-option:hover li {
    color: white;
}

.option-text {
    padding: 0 0 0 3.75vw;
}

.documents-for-search-infos {
    margin: 0 0 0 2.67vw;
}

.removable-tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0 1.35vw 3vh 2.67vw;
    border-bottom: 1px solid rgb(44, 62, 80);
    max-height: 7.4vh;
    overflow: hidden;
    overflow-y: scroll;
    min-height: 7.39vh;
}

.remove-tag-button {
    margin: 0 1.34vw 0 0;
    cursor: pointer;
}

.removable-tag-text {
    margin: 0 1.33vw 0 0;
}

.removable-tag {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 30px;
    margin: 1.5vh 4vw 0 0;
    padding: 1.5vh 1.34vw;
    background-color: #616161;
    color: white;
}


@media screen and (min-width: 475px) {
    .clickable-tags-list.with-carousel {
        height: 45.3vh;
    }
}

@media screen and (max-width: 475px) {
    .clickable-tags-list.with-carousel {
        height: 38.6vh;
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
    border-radius: 30px;
    margin: 15px 15px 0 0;
    padding: 2.25vh 4vw;
    text-align: center;
}

.disabled-tag {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #A9A9A9;
    color: white;
    border-radius: 30px;
    margin: 4vh 2.25vw 0 0;
    padding: 2.25vh 4vw;
    text-align: center;
}

.clickable-tag:hover {
    background-color: #616161;
    color: white;
    border: 1px solid white;
}

::-webkit-scrollbar {
    width: 4px;
    border: 1px solid #ffffff;
}

::-webkit-scrollbar-track {
    border-radius: 0;
    background: #eeeeee;
}

::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background: #b0b0b0;
}
</style>