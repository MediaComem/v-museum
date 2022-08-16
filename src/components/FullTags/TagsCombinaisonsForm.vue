<template>
    <form @submit="prevent">
        <legend>Images with tags form</legend>
        <!-- Quand l'utilisateur entre un tag avec enter, on l'ajoute, qu'il existe ou non. -->
        <input type="text" placeholder="SEARCH TAG TO FILTER" @focus="show_tags_options = true" @blur="show_tags_options = false"
            @input="updateSearchTag($event)" @keyup.enter="this.selected_tags.push(this.selected_tags[0])" />
    </form>
    <div class="documents-for-search-infos">
        <br />
        <span v-for="(tag, index) in this.selected_tags" :key="index">
            <span v-if="index != 0 && index != selected_tags.length - 1">#{{ tag }}, </span>
            <span v-else-if="index == selected_tags.length - 1">#{{ tag }}</span>
        </span>
        <span v-if="this.selected_tags[0] != ''">, </span>
        <span>{{ this.selected_tags[0] }}</span>
        <br />
        <span v-if="this.imagesWithTags.length > 0">{{ this.imagesWithTags.length }} documents</span>
        <span v-else>It seems no document contains the tags combinaison you entered.</span>
        <div class="tags-options" v-if="this.show_tags_options">
            <span v-for="(tag, index) in this.input_and_selected_tags_with_images" :key="index" @click="addTag(tag.tag)" style="color:blue">
                {{ tag.tag }} : {{ tag.nb_images }} documents</span>
        </div>
    </div>
    <!-- <div class="removable-tags">
        <div v-for="(tag, index) in this.selected_tags key"
    </div> -->
    <div ref="tags_to_display" class="canvas-display overflow tags-list" @scroll="scrollMove"
        @touchend="changeSlideScroll" @mousewheel="wheelMoveScroll">
        <div v-for="(tag, index) in this.selected_tags_with_images" :key="index" class="border">
            <div class="display-element clickable" @click="addTag(tag.tag)">
                        <!-- <div class="display-element clickable" @click="addTag(tag.tag)" @click="$emit('loadTagView', tag)"> -->
                <p :class="fontSize" @mouseover="this.show_carousel = true">{{ tag.tag }} • {{ tag.nb_images }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import images from '@/assets/data/images.json';
import tags from "@/assets/onboarding/tags.json";


export default {
    emits: ["updateTagsList"],
    data() {
        return {
            selected_tags: [''],
            images: images,
            selected_tags_with_images: {},
            input_and_selected_tags_with_images: {},
            tags: tags,
            show_tags_options: false
        }
    },
    methods: {
        updateSearchTag(event) {
            const formated_string = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
            this.selected_tags[0] = (formated_string)
        },
        addTag(tag) {
            if (!this.selected_tags.includes(tag)) {
                this.selected_tags.push(tag)
                //format data to pass to parent
                const formated_selected_tags = []
                for (let i = 1; i < this.selected_tags.length; i++) {
                    formated_selected_tags.push(this.selected_tags[i])
                }
                const data_to_return = {
                    selected_tags: formated_selected_tags,
                    images: this.imagesWithTags,
                    tags_list: this.selected_tags_with_images,
                    input_filter_tags_list: this.input_and_selected_tags_with_images
                }
                // console.log('passé en emit:', data_to_return)
                this.$emit('updateTagsList', data_to_return)
            }
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
            //Reset tags with images for update
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
                        //create a list of clickable tags with number of images
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