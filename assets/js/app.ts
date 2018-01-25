import Vue from 'vue'
import router from '../router' // contains all components imports

Vue.config.productionTip = false;

new Vue({
    //el: '#app',
    router,
    //template: '<ListOfConnections/>',
    //components: { ListOfConnections }
}).$mount('#app');
