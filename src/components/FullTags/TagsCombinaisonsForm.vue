<template>
    <form @submit="prevent">
        <legend>Images with tags form</legend>
        <!-- Quand l'utilisateur entre un tag avec enter, on l'ajoute, qu'il existe ou non. -->
        <input type="text" class="tag-filter-input" placeholder="SEARCH TAG TO FILTER" @focus="show_tags_options = true"
            @blur="show_tags_options = false" @input="updateSearchTag($event)"
            @keyup.enter="this.selected_tags.push(this.selected_tags[0])" />
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
            <span v-for="(tag, index) in this.input_and_selected_tags_with_images" :key="index" @click="addTag(tag.tag)"
                style="color:blue">
                {{ tag.tag }} : {{ tag.nb_images }} documents</span>
        </div>
    </div>

    <div class="removable-tags">
        <div v-for="(tag, index) in confirmed_tags" :key="index">
            <span>{{ tag }}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                @click="removeTag(index + 1)">
                <path
                    d="M4.84371 10.9L7.49996 8.24377L10.1562 10.9L10.9 10.1563L8.24371 7.50002L10.9 4.84377L10.1562 
            4.10002L7.49996 6.75627L4.84371 4.10002L4.09996 4.84377L6.75621 7.50002L4.09996 10.1563L4.84371 10.9ZM7.49996 
            14.5834C6.5319 14.5834 5.61697 14.3974 4.75517 14.0255C3.89336 13.6537 3.14076 13.146 2.49736 12.5026C1.85395 
            11.8592 1.34631 11.1066 0.974438 10.2448C0.602563 9.38301 0.416626 8.46808 0.416626 7.50002C0.416626 6.52016 0.602563 5.59933 0.974438 4.73752C1.34631 3.87572 1.85395 3.12606 2.49736 2.48856C3.14076 1.85106 3.89336 1.34637 4.75517 0.974499C5.61697 0.602624 6.5319 0.416687 7.49996 0.416687C8.47982 0.416687 9.40065 0.602624 10.2625 0.974499C11.1243 1.34637 11.8739 1.85106 12.5114 2.48856C13.1489 3.12606 13.6536 3.87572 14.0255 4.73752C14.3974 5.59933 14.5833 6.52016 14.5833 7.50002C14.5833 8.46808 14.3974 9.38301 14.0255 10.2448C13.6536 11.1066 13.1489 11.8592 12.5114 12.5026C11.8739 13.146 11.1243 13.6537 10.2625 14.0255C9.40065 14.3974 8.47982 14.5834 7.49996 14.5834ZM7.49996 13.5209C9.17635 13.5209 10.5989 12.9335 11.7677 11.7589C12.9364 10.5842 13.5208 9.1646 13.5208 7.50002C13.5208 5.82363 12.9364 4.40106 11.7677 3.23231C10.5989 2.06356 9.17635 1.47919 7.49996 1.47919C5.83538 1.47919 4.41576 2.06356 3.24111 3.23231C2.06645 4.40106 1.47913 5.82363 1.47913 7.50002C1.47913 9.1646 2.06645 10.5842 3.24111 11.7589C4.41576 12.9335 5.83538 13.5209 7.49996 13.5209Z"
                    fill="#616161" />
            </svg>
        </div>
    </div>

    <div ref="tags_to_display" class="canvas-display overflow tags-list" @scroll="scrollMove"
        @touchend="changeSlideScroll" @mousewheel="wheelMoveScroll">
        <div v-for="(tag, index) in this.selected_tags_with_images" :key="index" class="border">
            <div class="display-element clickable" @click="addTag(tag.tag)">
                <!-- <div class="display-element clickable" @click="addTag(tag.tag)" @click="$emit('loadTagView', tag)"> -->
                <p :class="fontSize" @mouseover="this.show_carousel = true">{{   tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1) }} • {{ tag.nb_images }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import images from '@/assets/data/images.json';
import tags from "@/assets/onboarding/tags.json";

export default {
    emits: ["updateTagsList"],
    props: {
        isMobile: Boolean,
    },
    data() {
        return {
            selected_tags: [''],
            images: images,
            selected_tags_with_images: {},
            input_and_selected_tags_with_images: {},
            tags: tags,
            show_tags_options: false,
            last_user_input: Date.now(),
            mytimeout: undefined,
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
                this.selected_tags.push(tag)
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
            this.selected_tags.splice(index)
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
            console.log('sdfhdsfdjajsfdhjasfdsdjkljh');
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
        }
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
    justify-content: center;
    align-items: center;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
    .display-element {
        width: 48vw;
        display: flex;
        justify-content: left;
        align-items: center;
    }
}

@media only screen and (min-width: 437px) and (max-width: 999px) {
    .display-element {
        width: 32vw;
        display: flex;
        justify-content: left;
        align-items: center;
    }
}

@media only screen and (min-width: 800px) {
    .display-element {
        width: 23vw;
        display: flex;
        justify-content: left;
        align-items: center;
    }
}

.desktop-font {
    font-size: normal;
}

.mobile-font {
    font-size: x-small;
}

.tags-list {
    height: 51vh;
    border-left: solid 1px black;
    border-top: solid 1px black;
}

.border {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: solid 1px black;
    border-right: solid 1px black;
    height: 70px;
}
</style>