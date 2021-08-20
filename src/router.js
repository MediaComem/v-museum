import { createRouter, createWebHashHistory } from "vue-router";
import ImageSelector from "./components/ImageSelector/ImageSelector.vue";

const routes = [
    {path: '/', redirect: '/selector/193'},
    {path: '/selector/:decade/:index', component: ImageSelector},
    {path: '/selector/:decade', component: ImageSelector}
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
  });

  export default router;