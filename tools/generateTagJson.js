const fs = require("fs");

const axios = require("axios");

const VUE_APP_FETCH_BASE = "https://v-museum.heig-vd.ch/api/items?";

const tags = [
  { tag: "Robot", totalImage: 736 },
  { tag: "Dinosaur", totalImage: 228 },
  { tag: "Insect", totalImage: 610 },
  { tag: "Reptile", totalImage: 283 },
  { tag: "Winged creature", totalImage: 1224 },
  { tag: "Water creature", totalImage: 445 },
  { tag: "Land creature", totalImage: 2543 },
  { tag: "Mythological creature", totalImage: 5244 },
  { tag: "Creature with Tentacles", totalImage: 251 },
  { tag: "Ghost", totalImage: 675 },
  { tag: "Skeleton", totalImage: 682 },
  { tag: "Humanoid", totalImage: 156 },
  { tag: "Living dead", totalImage: 58 },
  { tag: "Mechanical creature", totalImage: 141 },
  { tag: "Religious figure", totalImage: 52 },
  { tag: "Evil figure", totalImage: 942 },
  { tag: "Child", totalImage: 813 },
  { tag: "Plant creature", totalImage: 109 },
  { tag: "Young Man", totalImage: 21292 },
  { tag: "Young Woman", totalImage: 8864 },
  { tag: "Old man", totalImage: 6730 },
  { tag: "Old woman", totalImage: 503 },
  { tag: "Fight with vehicles", totalImage: 56 },
  { tag: "Fight with creatures", totalImage: 467 },
  { tag: "Armies battle", totalImage: 104 },
  { tag: "Confrontation", totalImage: 562 },
  { tag: "Takeoff/Landing", totalImage: 577 },
  { tag: "Encounter", totalImage: 230 },
  { tag: "Experiment", totalImage: 1463 },
  { tag: "Uncover", totalImage: 22 },
  { tag: "Defend", totalImage: 818 },
  { tag: "Compel", totalImage: 140 },
  { tag: "Swim", totalImage: 240 },
  { tag: "Spy", totalImage: 1196 },
  { tag: "Communicate", totalImage: 8211 },
  { tag: "Hug", totalImage: 367 },
  { tag: "Scream", totalImage: 6719 },
  { tag: "Run/Flee", totalImage: 2111 },
  { tag: "Climb", totalImage: 288 },
  { tag: "Shoot", totalImage: 970 },
  { tag: "Fly", totalImage: 2363 },
  { tag: "Hide", totalImage: 458 },
  { tag: "Drive/pilot", totalImage: 688 },
  { tag: "Struggle", totalImage: 11625 },
  { tag: "Threaten", totalImage: 4093 },
  { tag: "Blade", totalImage: 70 },
  { tag: "Firearm", totalImage: 2313 },
  { tag: "Raygun", totalImage: 585 },
  { tag: "Canon", totalImage: 103 },
  { tag: "Explosive", totalImage: 117 },
  { tag: "Machinegun", totalImage: 342 },
  { tag: "Axes", totalImage: 172 },
  { tag: "Sledgehammer", totalImage: 108 },
  { tag: "Stick", totalImage: 1079 },
  { tag: "Magic weapon", totalImage: 101 },
  { tag: "Throwing weapon", totalImage: 310 },
  { tag: "Stabbing weapon", totalImage: 2333 },
  { tag: "Electrical weapon", totalImage: 65 },
  { tag: "Mental weapon", totalImage: 52 },
  { tag: "Shield", totalImage: 155 },
  { tag: "Force field", totalImage: 10 },
  { tag: "Armour", totalImage: 492 },
  { tag: "Jewelery", totalImage: 1377 },
  { tag: "Time keeper", totalImage: 168 },
  { tag: "Artwork", totalImage: 525 },
  { tag: "Food", totalImage: 758 },
  { tag: "Screen", totalImage: 336 },
  { tag: "Book/Paper", totalImage: 2912 },
  { tag: "Flashlight", totalImage: 697 },
  { tag: "Gauge", totalImage: 762 },
  { tag: "Communication device", totalImage: 462 },
  { tag: "Scientific device", totalImage: 2892 },
  { tag: "Electrical device", totalImage: 2614 },
  { tag: "Music device", totalImage: 265 },
  { tag: "Medical device", totalImage: 335 },
  { tag: "Mechanical tool", totalImage: 458 },
  { tag: "Machinery", totalImage: 474 },
  { tag: "Religious artefact", totalImage: 138 },
  { tag: "Mask", totalImage: 134 },
  { tag: "Helmet", totalImage: 2464 },
  { tag: "Rocket", totalImage: 4556 },
  { tag: "Spacecraft", totalImage: 4979 },
  { tag: "Submarine", totalImage: 101 },
  { tag: "Vehicle with sails", totalImage: 603 },
  { tag: "Vehicle with tracks", totalImage: 24 },
  { tag: "Vehicles with propellers", totalImage: 351 },
  { tag: "Flying vehicle", totalImage: 6312 },
  { tag: "Wheeled vehicle", totalImage: 1225 },
  { tag: "Sliding vehicles", totalImage: 19 },
  { tag: "Vehicle with legs", totalImage: 9 },
  { tag: "Glidding vehicle", totalImage: 9 },
  { tag: "Autonomous vehicle", totalImage: 1 },
  { tag: "Tracked vehicle", totalImage: 124 },
  { tag: "Levitating vehicle", totalImage: 27 },
  { tag: "Hovercraft", totalImage: 19 },
  { tag: "Wreck", totalImage: 66 },
  { tag: "Control panel", totalImage: 280 },
  { tag: "Kitchen", totalImage: 65 },
  { tag: "Living room", totalImage: 1813 },
  { tag: "Lab", totalImage: 2045 },
  { tag: "Command room", totalImage: 190 },
  { tag: "Bedroom", totalImage: 397 },
  { tag: "Tunnel/Corridor", totalImage: 153 },
  { tag: "Cave", totalImage: 295 },
  { tag: "Hut", totalImage: 165 },
  { tag: "Workshop", totalImage: 284 },
  { tag: "Religious interior", totalImage: 55 },
  { tag: "Hall/Lobby", totalImage: 899 },
  { tag: "Classroom", totalImage: 69 },
  { tag: "Prison", totalImage: 96 },
  { tag: "Warehouse", totalImage: 12 },
  { tag: "Arena", totalImage: 129 },
  { tag: "Library", totalImage: 207 },
  { tag: "Desk", totalImage: 3501 },
  { tag: "Cage", totalImage: 174 },
  { tag: "City", totalImage: 2162 },
  { tag: "Village", totalImage: 308 },
  { tag: "Industrial zone", totalImage: 81 },
  { tag: "Fields", totalImage: 233 },
  { tag: "Bridge", totalImage: 341 },
  { tag: "Tower", totalImage: 285 },
  { tag: "River", totalImage: 285 },
  { tag: "Sea/Lake", totalImage: 1670 },
  { tag: "Mountain", totalImage: 3210 },
  { tag: "Desert", totalImage: 149 },
  { tag: "Crater", totalImage: 356 },
  { tag: "Forest", totalImage: 1868 },
  { tag: "Stars", totalImage: 4658 },
  { tag: "Wasteland", totalImage: 474 },
  { tag: "Ruins", totalImage: 47 },
  { tag: "Castle", totalImage: 343 },
  { tag: "Palace", totalImage: 219 },
  { tag: "Path/street", totalImage: 4101 },
  { tag: "Rocks/cliffs", totalImage: 2614 },
  { tag: "Sun", totalImage: 368 },
  { tag: "Moon", totalImage: 2300 },
  { tag: "Comet", totalImage: 440 },
  { tag: "Black sky", totalImage: 9900 },
  { tag: "Starry sky", totalImage: 641 },
  { tag: "White sky", totalImage: 9125 },
  { tag: "Day-night transition", totalImage: 47 },
  { tag: "Clouds", totalImage: 2615 },
  { tag: "Smoke", totalImage: 3424 },
  { tag: "Rain", totalImage: 131 },
  { tag: "Snow", totalImage: 91 },
  { tag: "Ice", totalImage: 56 },
  { tag: "Wind", totalImage: 884 },
  { tag: "Gas", totalImage: 8 },
  { tag: "Fog", totalImage: 35 },
  { tag: "Poison", totalImage: 4 },
  { tag: "Fire", totalImage: 1592 },
  { tag: "Explosion", totalImage: 888 },
  { tag: "Collision", totalImage: 192 },
  { tag: "Fall", totalImage: 30 },
];

const parseImagesByTag = (data) => {
  const images = [];
  data.forEach((element) => {
    images.push({
      imageId: element["dcterms:identifier"][0]["@value"],
      url: element["thumbnail_display_urls"]["medium"],
    });
  });
  return images;
};

const getImageByTag = async (currentPage, tag) => {
  const params = {
    params: {
      sort_by: "dcterms=identifier",
      sort_order: "asc",
      per_page: 500,
      "property[0][property]": 14,
      "property[0][type]": "eq",
      "property[0][text]": tag,
      page: currentPage,
    },
  };
  try {
    const { data } = await axios.get(VUE_APP_FETCH_BASE, params);
    return parseImagesByTag(data);
  } catch (e) {
    console.log(e);
  }
};

const load = async () => {
  try {
    for (let j = 0; j <= tags.length; j++) {
      let images = [];
      console.log("Genereate tag: " + tags[j].tag);
      for (let i = 1; i <= Math.ceil(tags[j].totalImage / 500); i++) {
        const data = await getImageByTag(i, tags[j].tag);
        images = images.concat(data);
      }
      let fileName = tags[j].tag;
      if (fileName.includes("/")) {
        fileName = fileName.replace("/", "");
      }
      fs.appendFileSync(`${fileName}.json`, JSON.stringify(images));
    }
  } catch (e) {
    console.log(e);
  }
};

load();
