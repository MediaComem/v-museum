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
        <span v-for="(tag, index) in tagsForSelection" :key="index" @click="addTag(tag.tag)" style="color:red">{{ tag.tag}}</span>
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
            no_input_tags_to_return: {},
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
                    tags_list: this.no_input_tags_to_return
                }
                console.log('passé en emit:', data_to_return)
                this.$emit('updateTagsList', data_to_return)
            }
        },
        arrayInArray(arr1, arr2) {
            let i = 0
            let ok = true 
            do {
                if(!arr2.includes(arr1[i].toLowerCase())) {
                    ok = false
                }
                i++
            } while (ok && i < arr1.length)
            return ok
        }
    },
    computed: {
        imagesWithTags() {
            //If user didnt add any tag, basic image are used
            if (this.selected_tags.length == 1) {
                return this.images
            }
            //Reset tags with images for update
            const tags_to_return = {}
            //Get only images including tag in array of selected tags
            const images_with_tags = this.images.filter((im) => {
                let ok = true
                let i = 1;
                do {
                //Management of case sensitivity for UX
                    const img_lower_case_tags = []
                    im.tags.forEach(tg => {
                        img_lower_case_tags.push(tg.toLowerCase())
                    })
                    //create a list of clickable tags with number of images
                    if (img_lower_case_tags.includes(this.selected_tags[i].toLowerCase())) {
                        img_lower_case_tags.forEach(img_tag => {
                        //Ensure all selected tags are into the image tags    
                        let all_tags_ok = this.arrayInArray(this.selected_tags, img_lower_case_tags)    
                            // Cas 1, on a le tag dans l'image donc, get + add
                            if (tags_to_return[img_tag] && all_tags_ok) {
                                tags_to_return[img_tag].nb_images += 1
                            } else if (!tags_to_return[img_tag] && all_tags_ok) {
                            // Cas 2, on a pas le tag => ajouter tag + total = 1
                                tags_to_return[img_tag] = {
                                    nb_images: 1
                                }
                            }
                        })
                    } else {
                        ok = false
                    }
                    i++;
                } while (ok && i < this.selected_tags.length)
                this.no_input_tags_to_return = tags_to_return
                return ok
            })
            console.log("LES IMAGES:", this.no_input_tags_to_return)
            return images_with_tags
        },
        tagsForSelection() {
            const tags_with_combi_and_string = []
            this.tags.tags.forEach(tag => {
                const formated_string = this.selected_tags[0].toLowerCase();
                if (this.selected_tags.length == 1) {
                    if(tag.toLowerCase().includes(formated_string)){
                        const tag_data = {
                        tag: tag.tag.toLowerCase(),
                        nb_images: tag.totalImage
                    } 
                    }
                } else {
                    const stored_tag = this.no_input_tags_to_return[tag.tag.toLowerCase()]
                    if (stored_tag != undefined) {
                        tag_data.nb_images = stored_tag.nb_images
                    }
                    tags_with_string.push(tag_data)
                }
            })
            return tags_with_combi_and_string
        },
    }
}
</script>