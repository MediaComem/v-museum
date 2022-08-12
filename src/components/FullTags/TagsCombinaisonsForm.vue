<template>
    <form>
        <legend>Images with tags form</legend>
        <label>{{ this.selected_tags[0] }}</label>
        <input type="text" placeholder="change" @input="addTag($event)"/>
        <label>{{ this.imagesNumber.value }}</label>
    </form>
</template>

<script>
import { ref } from 'vue'
import images from '@/assets/data/images.json';

export default {
    props: {
        showImagesNumber: Boolean,
        selectedTags: Array,
    },
    data() {
        return {
            selected_tags: this.selectedTags,
            images: images,
            other_images_tags: ref([]),
            images_number: ref(this.imagesWithTags.length)
        }
    },
    methods: {
        addTag(event){
            
            console.log(event.target.value, this.imagesWithTags)
        }
    },
    computed: {
        imagesWithTags() {
            const images_with_tags = this.images.filter((im) => {
                let ok = true
                let i = 0;
                do {
                    if (!im.tags.includes(this.selectedTags[i])) {
                        ok = false
                    }
                    i++;
                } while (ok && i < this.selectedTags.length)
                return ok
            })
            return images_with_tags
        }
    }
}
</script>