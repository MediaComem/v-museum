import { createRouter, createWebHashHistory } from "vue-router";
import Onboarding from "./components/Onboarding/Onboarding.vue";
import FullImage from "./components/FullImage/FullImage.vue";
import CanvasTemplate from "./components/Canvas/CanvasTemplate.vue";
import FullTagLayout from "./components/FullTags/FullTagLayout.vue";
import About from "./components/About/About.vue";
import TagsSlide from './components/Search/TagsSlide.vue';

const routes = [
    {name: 'onboarding', path: '/', component: Onboarding},
    {name: 'image', path: '/image/:index', component: FullImage},
    {name: 'canvas', path: '/canvas', component: CanvasTemplate},
    {name: 'full_tag', path: '/full_tag', component: FullTagLayout},
    {name: 'search', path: '/search', component: TagsSlide},
    {name: 'about', path: '/about', component: About},
    {name: 'tags_slide', path: '/tags_slide', component: Onboarding}
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  });

  export default router;