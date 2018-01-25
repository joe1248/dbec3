let Encore = require('@symfony/webpack-encore');
//let path = require('path');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/build/')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())

    // uncomment to create hashed filenames (e.g. app.abc123.css)
    .enableVersioning(true)//Encore.isProduction())

    // Breaks and no point if you still include it in the base template.....createSharedEntry('vendor_legacy', [
    .addEntry('vendor_legacy', [
        //'./assets/js/lib/vendor_legacy.js',
        //'./assets/js/lib/jquery-1.11.0.min.js',
        //'./assets/js/lib/jquery-ui.1.10.4.min.js',
        //'./assets/js/lib/spin.min.js',
        './assets/js/lib/proto.js',

        './assets/css/lib/jquery-ui.min.css',
        './assets/css/lib/flick.css',
        './assets/css/lib/css.css',
    ])

    .addEntry('login', ['./assets/js/login.js'])

    .addEntry('app', [
        './assets/js_preloaded/pages_map.js',
        './assets/js_preloaded/welcome_page.js',
        './assets/js_preloaded/session_timeout.js',

        './assets/js/app.js',
        //'./assets/components/ListOfConnections.vue',

        /*       './assets/js_preloaded/0_common_delete.js',
               './assets/js_preloaded/js_trees/tree_core.js',
               './assets/js_preloaded/js_trees/clone1_fct_trees.js',
               './assets/js_preloaded/js_trees/action_edit.js',
               './assets/js_preloaded/js_trees/js_only_tree.js',
               './assets/js_preloaded/js_trees/jquery.jstree.js',
               //'./assets/js_preloaded/js_trees/tree_base.js',
               './assets/js_preloaded/js_trees/getHtmlIdFromRelPath.js',
               './assets/js_preloaded/obfuscation.js',
               // is not strict cos delete vars './assets/js_preloaded/sorttable.js',
               './assets/js_preloaded/3_cloning_helpers/A0_view_ui.js',
               './assets/js_preloaded/3_cloning_helpers/A1_clone_ui_setup.js',
               './assets/js_preloaded/3_cloning_helpers/A2_clone_ui_fct.js',
               './assets/js_preloaded/3_cloning_helpers/A3_start_db_compare_or_paste.js',
               './assets/js_preloaded/3_cloning_helpers/A4_db_compare_and_extraction_progress.js',
               './assets/js_preloaded/3_cloning_helpers/B0_view_extraction.js',
               './assets/js_preloaded/3_cloning_helpers/B1_extraction_progress_and_end.js',
               './assets/js_preloaded/3_cloning_helpers/C0_view_transfer.js',
               './assets/js_preloaded/3_cloning_helpers/C1_paste_ui_setup.js',
               './assets/js_preloaded/3_cloning_helpers/C2_paste_reset_1_target_ui_and_post.js',
               './assets/js_preloaded/3_cloning_helpers/C3_paste_progress.js',
       */
        './assets/css/0_dashboard.css',
        './assets/css/3_cloning_data_ui.css',
        './assets/css/4_bind_data.css'
    ])

    // uncomment if you use Sass/SCSS files
    // .enableSassLoader()
    .enableVueLoader()

    // uncomment for legacy applications that require $/jQuery as a global variable
    //.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();

// fetch the config, then modify it!
//let config = Encore.getWebpackConfig();
//config.watchOptions = { poll: true, ignored: /node_modules/ };


// other examples: add an alias or extension
//config.resolve.alias.local = path.resolve(__dirname, 'assets');
// config.resolve.extensions.push('json');
//console.log(config.resolve);

// export the final config
//module.exports = config;