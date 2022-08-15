<template>
    <form>
        <legend>Images with tags form</legend>
        <input type="text" placeholder="SEARCH TAG TO FILTER" @input="updateSearchTag($event)" />
        <br />
        <span v-for="(tag, index) in this.selected_tags" :key="index">
            <span v-if="index != 0 && index != selected_tags.length - 1">#{{ tag }}, </span>
            <span v-else-if="index == selected_tags.length - 1">#{{ tag }}</span>
        </span>
        <span v-if="this.selected_tags[0] != ''">, </span>
        <span>{{ this.selected_tags[0] }}</span>
        <br />
        <span>{{ this.imagesWithTags.length }} documents</span>
        <span v-for="(tag, index) in tagsForInput" :key="index" @click="addTag(tag)" style="color:red">{{ tag }}</span>
    </form>
</template>

<script>
import { ref } from 'vue'
import images from '@/assets/data/images.json';
import tags from "@/assets/onboarding/tags.json";


export default {
    data() {
        return {
            selected_tags: ref(['']),
            images: images,
            tags: tags,
        }
    },
    methods: {
        updateSearchTag(event) {
            const formated_string = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
            this.selected_tags[0] = (formated_string)
            console.log(this.selected_tags, this.imagesWithTags)
        },
        addTag(tag) {
            if (!this.selected_tags.includes(tag)) {
                this.selected_tags.push(tag)
            }
        }
    },
    computed: {
        imagesWithTags() {
            if (this.selected_tags.length == 1) {
                return this.images
            }
            const images_with_tags = this.images.filter((im) => {
                let ok = true
                let i = 1;
                do {
                    const lower_case_tags = []
                    im.tags.forEach(tg => {
                        lower_case_tags.push(tg.toLowerCase())
                    })
                    if (!lower_case_tags.includes(this.selected_tags[i].toLocaleLowerCase())) {
                        ok = false
                    }
                    i++;
                } while (ok && i < this.selected_tags.length)
                return ok
            })
            return images_with_tags
        },
        tagsForInput() {
            const tags_with_string = []
            this.tags.tags.forEach(tag => {
                const formated_string = this.selected_tags[0].toLowerCase();
                if (tag.tag.toLowerCase().includes(formated_string)) {
                    tags_with_string.push(tag.tag)
                }
            })
            console.log(tags_with_string)
            return tags_with_string
        },
        // otherPossibleTags() {
        //     const possibilities = []
        //     this.tagsForInput.forEach(tg => {
        //         const possibility = {
        //             tag: tg,
        //             nb_images: 0
        //         }
        //         this.imagesWithTags.forEach(img => {
        //             if(img.tags.includes(tg)) {
        //                 possibility.nb_images += 1;
        //             }
        //         })
        //         possibilities.push(possibility)
        //     })
        //     console.log('possibilites:', possibilities)
        //     return possibilities
        // }
    }
}
</script>