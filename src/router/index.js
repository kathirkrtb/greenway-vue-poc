import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SetPassword from '../views/SetPassword'
import ListUsers from '../views/ListUsers'

const routes = [
  {
    path: '/',
    meta: { title: "Users", layoutName: 'default' },
    component: ListUsers
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layoutName: 'plain' },
  },
  {
    path: '/password/:id',
    name: 'password',
    component: SetPassword,
    meta: { layoutName: 'plain' },
  },
  {
    path: '/list',
    name: 'list',
    meta: { title: "Users", layoutName: 'default' },
    component: ListUsers
  },
  {
    path: '/add-user',
    name: 'AddUser',
    meta: { title: "Add User", layoutName: 'default' },
    component: () => import('../views/AddUser.vue')
  },
  {
    path: '/edit-user/:id',
    name: 'EditUser',
    meta: { title: "Edit User", layoutName: 'default' },
    component: () => import('../views/EditUser.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


//auth guard to protect routes
var isAuthenticated = true;
router.beforeEach((to, from, next) => {

  if (localStorage.getItem('_token') == null) {
    isAuthenticated = false;
  }
  var functionsWithoutAuth = ["login", "password"];

  if (!functionsWithoutAuth.includes(to.name) && !isAuthenticated) next({ name: 'login' })
  else if (to.name === "login" && isAuthenticated) next({ name: 'list' })
  else next()
})



export default router
