import Vue from 'vue'
import ListOfConnections from '../components/ListOfConnections'
import router from '../router'

Vue.config.productionTip = false;

new Vue({
    //el: '#app',
    router
    //template: '<ListOfConnections/>',
    //components: { ListOfConnections }
}).$mount('#app');
