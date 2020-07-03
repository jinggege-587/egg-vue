import Vue from 'vue';

import VueRouter from 'vue-router';
import Dashboard from '../view/dashboard/index.vue';
import ArticleList from '../view/list.vue';

Vue.use(VueRouter);

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/admin/',
    routes: [
      {
        path: '/',
        component: Dashboard
      },
      {
        path: '/article/list',
        component: ArticleList,
        meta: {
          noAll:true
        }
      },
      {
        path: '/article/add',
        component: () => import('../view/write/index.vue'),
        meta: {
          noAll:true
        }
      },
      {
        path: '/article/rayTree',
        component: () => import('../view/rayTree.vue'),
        meta: {
          noAll:true
        }
      },
      {
        path: '/article/jing',
        component: () => import('../view/jing.vue'),
        meta: {
          noLeft: true,
          noHead: true,
          noAll:true
        }
      },
      {
        path: '/article/decisionTree',
        component: () => import('../view/decisionTree.vue'),
        meta: {
          noLeft: true,
          noHead: true,
          noAll:true
        }
      },
      {
        path: '/article/decisionRayTree',
        component: () => import('../view/decisionRayTree.vue'),
        meta: {
          noLeft: true,
          noHead: true,
          noAll:true
        }
      },
      {
        path: '/article/detail/:id',
        component: () => import('../view/detail.vue')
      },
      {
        path: '*', component: () => import('../view/notfound.vue')
      }
    ]
  });
}