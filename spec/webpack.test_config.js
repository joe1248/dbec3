var webpackConfig = {
    context: '/home/vagrant/projects/dbec3',
    module: { rules: [] },
    plugins:[],
    devtool: 'inline-source-map',
    performance: { hints: false },
    output: {
        path: '/home/vagrant/projects/dbec3/public/build',
        filename: '[name].[chunkhash].js',
        publicPath: '/build/',
        pathinfo: true
    },
    stats:
        { hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            maxModules: 0,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: false,
            errorDetails: false,
            warnings: false,
            publicPath: false },
    resolve:
        { extensions: [ '.js', '.jsx', '.vue', '.ts', '.tsx' ],
            alias: { 'vue$': 'vue/dist/vue.esm.js' }
        }
};
