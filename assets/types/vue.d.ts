declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

// this gets rid of IDE error on Object.assign ES6 feat.
declare interface ObjectConstructor {
    assign(...objects: Object[]): Object;
}