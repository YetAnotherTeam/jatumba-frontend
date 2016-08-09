module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            build: {
                separator: ';\n',
                src: [
                    "libs/materialize.min.js",
                    "libs/howler.js",
                    <!-- IE required polyfills, in this exact order -->
                    "node_modules/es6-shim/es6-shim.min.js",
                    "node_modules/systemjs/dist/system-polyfills.js",
                    "node_modules/angular2/es6/dev/src/testing/shims_for_IE.js",
                    "node_modules/angular2/bundles/angular2-polyfills.js",
                    "node_modules/systemjs/dist/system.src.js",
                    "node_modules/rxjs/bundles/Rx.js",
                    "node_modules/angular2/bundles/angular2.dev.js",
                    "node_modules/angular2/bundles/http.dev.js",
                    "node_modules/angular2/bundles/router.dev.js",
                ],
                dest: 'build/build.concat.js'
            }
        },
        uglify: {
            build: {
                files: {
                    'build/build.min.js': ['build/build.concat.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build', ['concat:build', 'uglify:build']);
    grunt.registerTask('default', ['build']);
};
