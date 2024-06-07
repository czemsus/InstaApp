import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";

const HomeView = () => import("@/views/HomeView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const EditView = () => import("@/views/EditView.vue");
const NotFoundView = () => import("@/views/NotFoundView.vue");
const UserView = () => import("@/views/UserView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit",
      name: "edit",
      component: EditView,
      meta: { requiresAuth: true },
    },
    {
      path: "/user/:email",
      name: "user",
      component: UserView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFoundView",
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("userToken");
    if (token) {
      const isValid = await store.dispatch("GET_VALID", token);
      if (isValid) {
        store.commit("SET_USER_TOKEN", token);
        next();
      } else {
        next("/login");
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
