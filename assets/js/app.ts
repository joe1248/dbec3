import Vue from 'vue'
import router from '../router' // contains all components imports

Vue.config.productionTip = false;

// @ts-ignore: wrong type for router ??
new Vue({
    //el: '#app',
    router,
    //template: '<ListOfConnections/>',
    //components: { ListOfConnections }
}).$mount('#app');
