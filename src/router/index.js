import { createRouter, createWebHashHistory } from "vue-router";
import Introducation from "../views/introducation.vue";
import Map from "../views/map.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Map,
      children: [
        {
          path: "/introducation",
          component: Introducation,
        },
      ],
    },
  ],
});

export default router;
