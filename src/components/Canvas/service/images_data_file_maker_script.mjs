import * as fs from 'fs';

const files = fs.readdirSync("./files");
const stored_image_ids = new Set();
const images = [];

for (let i = 0; i < files.length; i++) {
    //Get all images from files
    const data = fs.readFileSync(`files/${files[i]}`);
    const buffer = Buffer.from(data)
    const imgs_string = buffer.toString()
    const imgs_array = JSON.parse(imgs_string)
    //Put new image in imags array if not already into, otherwise only add its filename to tags
    imgs_array.forEach(img => {
        let tag_to_add = files[i].split('.json')[0]
        if (!stored_image_ids.has(img.imageId)) {
            stored_image_ids.add(img.imageId)
            const json_img = {
                "id": img.imageId,
                "url": img.url,
                "tags": [tag_to_add]
            }
            images.push(json_img)
        } else {
            const stored_image = images.filter((a) => a.id == img.imageId)[0]
            stored_image.tags.push(tag_to_add)
        }
    })
}

fs.writeFile('images.json', JSON.stringify(images), function (err) {
    if (err) { return console.log(err) };
});

