import { createRouter, createWebHashHistory } from "vue-router";
import Onboarding from "./components/Onboarding/Onboarding.vue";
import ImageSelector from "./components/ImageSelector/ImageSelector.vue";
import FullImage from "./components/FullImage/FullImage.vue";
import CanvasTemplate from "./components/Canvas/CanvasTemplate.vue";

const routes = [
    {name: 'onboarding', path: '/', component: Onboarding},
    {name: 'back', path: '/selector', redirect: '/'},
    {name: 'selector', path: '/selector/:decade/:index?', component: ImageSelector},
    {name: 'image', path: '/image/:index', component: FullImage},
    {name: 'canvas', path: '/canvas', component: CanvasTemplate},
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  });

  export default router;