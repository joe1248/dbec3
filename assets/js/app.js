import Vue from 'vue'
import ListOfConnections from '../components/ListOfConnections'

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<ListOfConnections/>',
    components: { ListOfConnections }
});
