import Vue from 'vue'
import Router from 'vue-router'
import ListOfConnections from './components/ListOfConnections.vue'
import EditConnection from './components/EditConnection.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/list-of-connections',
            name: 'ListOfConnections',
            component: ListOfConnections,
            props: true,
        },
        {
            path: '/edit-connection/:id',
            name: 'EditConnection',
            component: EditConnection,
            props: true,
        },
    ],
})