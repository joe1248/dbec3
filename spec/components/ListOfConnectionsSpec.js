describe('ListOfConnectionsSpecs', function() {
    //var Player = require('../../lib/jasmine_examples/Player');
    //var Song = require('../../lib/jasmine_examples/Song');
    let Vue = require('vue');
    let ListOfConnections = require('./../../assets/components/ListOfConnections.vue');
    let connections = [];

    beforeEach(function() {
        //player = new Player();
        //song = new Song();
    });
    
    // Inspect the raw component options
    it('has a created hook', () => {
        expect(typeof ListOfConnections.created).toBe('function')
    })

    // Evaluate the results of functions in
    // the raw component options
    it('sets the correct default data', () => {
        expect(typeof ListOfConnections.data).toBe('function')
        const defaultData = ListOfConnections.data()
        expect(defaultData.message).toBe('hello!')
    })

    // Inspect the component instance on mount
    it('correctly sets the message when created', () => {
        const vm = new Vue(ListOfConnections).$mount()
        expect(vm.message).toBe('bye!')
    })

    // Mount an instance and inspect the render output
    it('renders the correct message', () => {
        const Constructor = Vue.extend(ListOfConnections)
        const vm = new Constructor().$mount()
        expect(vm.$el.textContent).toBe('bye!')
    })
})