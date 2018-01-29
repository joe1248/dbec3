import Vue from 'vue'
import router from '../router' // contains all components imports
import Dashboard from '../components/Dashboard.vue'; // find out why .vue is mandatory here...

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'DBEC Dashboard';
    next();
});

new Vue({
    el: '#app',
    router,
    components: { Dashboard }
});
