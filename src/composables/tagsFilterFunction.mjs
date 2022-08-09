import * as fs from 'fs';

export default function tagsCombinaisons(tag, file_path) {
    const data = fs.readFileSync(file_path)
    const buf = Buffer.from(data)
    let images = buf.toString()
    images = JSON.parse(images)
    const images_with_tag = images.filter((img) => img.tags.includes(tag))
    // console.log(images_with_tag[0].tags)
    const combinable_tags = []
    images_with_tag.forEach(img => {
        img.tags.forEach((tag) => {
            if (!combinable_tags.includes(tag)) {
                combinable_tags.push(tag)
            }
        })
    })
    // console.log(combinable_tags[1])
    const tag_combinaisons = []
    for (let i = 0; i < combinable_tags.length; i++) {
        for (let z = combinable_tags.length - 1; z > i; z--) {
            const combi = [combinable_tags[i], combinable_tags[z]]
            tag_combinaisons.push(combi)
        }
    }
    // console.log(tag_combinaisons[0])
    const json_combinaisons = []
    tag_combinaisons.forEach((tag_combi) => {
        const images_with_tag = imagesWithTags(images, tag_combi)
        const json_combi = {
            "tags": tag_combi,
            "nb_images": images_with_tag.length,
        }
        json_combinaisons.push(json_combi)
    })
    //console.log(json_combinaisons)
    return json_combinaisons
}


function imagesWithTags(images, tags) {
    const images_with_tags = images.filter((im) => {
        let ok = true
        let i = 0;
        do {
            if (!im.tags.includes(tags[i])) {
                ok = false
            }
            i++;
        } while (ok && i < tags.length)
        return ok
    })
    return images_with_tags
}

