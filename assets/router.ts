import Vue from 'vue'
import VueRouter from 'vue-router'
import ListOfConnections from './components/ListOfConnections.vue'
import EditConnection from './components/EditConnection.vue'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/list-of-connections',
            name: 'ListOfConnections',
            meta: {title: 'Your connections'},
            component: ListOfConnections,
            props: true,
        },
        {
            path: '/edit-connection/:id',
            name: 'EditConnection',
            meta: {title: 'Edit connection'},
            component: EditConnection,
            props: true,
        },
        {
            path: '/new-connection',
            name: 'NewConnection',
            meta: {title: 'New connection'},
            component: EditConnection,
            props: false,
        },
    ]
});