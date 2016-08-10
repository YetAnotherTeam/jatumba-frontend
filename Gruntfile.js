module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            build: {
                separator: ';\n',
                src: [
                    "libs/less.js",
                    "libs/jquery.js",
                    "libs/materialize.min.js",
                    "libs/howler.js",
                    "node_modules/masonry-layout/dist/masonry.pkgd.js",
                    "node_modules/hellojs/hello.all.min.js",
                    "node_modules/es6-shim/es6-shim.min.js",
                    "node_modules/systemjs/dist/system-polyfills.js",
                    "node_modules/angular2/es6/dev/src/testing/shims_for_IE.js",
                    "node_modules/angular2/bundles/angular2-polyfills.js",
                    "node_modules/systemjs/dist/system.src.js",
                    "node_modules/rxjs/bundles/Rx.js",
                    "node_modules/angular2/bundles/angular2.dev.js",
                    "node_modules/angular2/bundles/http.dev.js",
                    "node_modules/angular2/bundles/router.dev.js"
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
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/build.min.css': [
                        'libs/materialize.css',
                        'libs/font-awesome/css/font-awesome.min.css',
                        'libs/sb-admin.css'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('build', ['concat:build', 'uglify:build', 'cssmin']);
    grunt.registerTask('default', ['build']);
};
