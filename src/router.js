import { createRouter, createWebHashHistory } from "vue-router";
import Onboarding from "./components/Onboarding/Onboarding.vue";
import ImageSelector from "./components/ImageSelector/ImageSelector.vue";

const routes = [
    {path: '/', component: Onboarding},
    {path: '/selector', redirect: '/selector/193'},
    {path: '/selector/:decade/:index?', component: ImageSelector},
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  });

  export default router;