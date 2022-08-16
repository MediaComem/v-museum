<template>
    <form @submit="prevent">
        <legend>Images with tags form</legend>
        <!-- Quand l'utilisateur entre un tag avec enter, on l'ajoute, qu'il existe ou non. -->
        <input type="text" placeholder="SEARCH TAG TO FILTER" @input="updateSearchTag($event)"
            @keyup.enter="this.selected_tags.push(this.selected_tags[0])" />
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
        <!-- <span v-for="(tag, index) in tagsForSelection" :key="index" @click="addTag(tag.tag)" style="color:red">{{
                tag.tag
        }}</span> -->
    </div>
    <!-- <div class="removable-tags">
        <div v-for="(tag, index) in this.selected_tags key"
    </div> -->
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
                const data_to_return = {
                    selected_tags: this.selected_tags,
                    images: this.imagesWithTags,
                    tags_list: this.selected_tags_with_images,
                    input_filter_tags_list: this.input_and_selected_tags_with_images
                }
                console.log('passé en emit:', data_to_return)
                this.$emit('updateTagsList', data_to_return)
            }
        },
        userTagsInImageTags(arr1, arr2) {
            //specify start_index = 1 so we dont take consideration of user input
            let i = 1
            let ok = true
            do {
                if (!arr2.includes(arr1[i].toLowerCase())) {
                    ok = false
                }
                i++
            } while (ok && i < arr1.length)
            return ok
        },
    },
    computed: {
        imagesWithTags() {
            //If user didnt add any tag, basic image are used
            if (this.selected_tags.length == 1) {
                return this.images
            }
            //Reset tags with images for update
            const tags_without_input = {}
            const tags_with_input = {}
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
                            let entered_tags_ok = this.userTagsInImageTags(this.selected_tags, img_lower_case_tags)
                            // let entered_tags_ok = true
                            // Case 1, this tag was already in a image to keep
                            if (tags_without_input[img_tag] && entered_tags_ok) {
                                tags_without_input[img_tag].nb_images += 1
                                //Check if the possible tags match user unconfirmed input
                                if (img_lower_case_tags.includes(this.selected_tags[0].toLowerCase())) {
                                    if (tags_with_input[img_tag]) {
                                        tags_with_input[img_tag].nb_images += 1
                                    } else {
                                        tags_with_input[img_tag] = { nb_images: 1 }
                                    }
                                }
                            }
                            // Case 2, no image parcoured had the tag to add yet
                            else if (!tags_without_input[img_tag] && entered_tags_ok) {
                                tags_without_input[img_tag] = { nb_images: 1 }
                                //Check if possible tags matches user unconfirmed input
                                if (img_lower_case_tags.includes(this.selected_tags[0].toLowerCase())) {
                                    tags_with_input[img_tag] = { nb_images: 1 }
                                }
                            }
                        })
                    } else {
                        ok = false
                    }
                    i++;
                } while (ok && i < this.selected_tags.length)
                this.selected_tags_with_images = tags_without_input
                this.input_and_selected_tags_with_images = tags_with_input
                return ok
            })
            console.log("LES IMAGES:", this.selected_tags_with_images, "Les images + input:", this.input_and_selected_tags_with_images, "input: ", this.selected_tags[0])
            return images_with_tags
        },
    }
}
</script>