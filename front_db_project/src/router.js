import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    name: "Acceuil",
    component: () => import("./components/Accueil")
  },

  {
    path: "/billets",
    name: "billets",
    component: () => import("./components/BilletsList")
  },

  {
    path: "/billets/:id",
    name: "billet-details",
    component: () => import("./components/Billet")
  },
  {
    path: "/add",
    name: "add",
    component: () => import("./components/AddBillet")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;