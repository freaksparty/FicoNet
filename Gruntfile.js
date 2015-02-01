module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            less: {
                files: "frontend/dev/less/**/*.less",
                tasks: ["less"]
            },
            uglify: {
                files: "frontend/dev/js/**/*.js",
                tasks: ["uglify"]
            },
            jade: {
                files: "frontend/dev/views/**/*.jade",
                tasks: ["jade"]
            }
        },
        less: {
            styles: {
                options: {
                    paths:             ["frontend/dev/less/"],
                    cleancss:          true,
                    strictMath:        true,
                    sourceMap:         true,
                    outputSourceFiles: true,
                    sourceMapURL:      'styles.css.map',
                    sourceMapFilename: 'frontend/static/css/styles.css.map'
                },
                files: {
                    "frontend/static/css/styles.css": [
                        "**/lato.less",
                        "**/bootstrap.less", 
                        "**/font-awesome.less",
                        "**/styles.less"
                    ]
                }
            }
        },
        uglify: {
            js: {
                options: {
                },
                files: {
                    'frontend/static/js/scripts.js': [
                        'frontend/dev/js/libs/jquery.js',
                        'frontend/dev/js/libs/angular.js',
                        'frontend/dev/js/libs/angular-resource.js',
                        'frontend/dev/js/libs/angular-route.js',
                        'frontend/dev/js/libs/angular-cookies.js',
                        'frontend/dev/js/libs/ui-bootstrap.js',
                        'frontend/dev/js/libs/ui-bootstrap-tpls.js',
                        'frontend/dev/js/app/app.js', 
                        'frontend/dev/js/app/services/*.js', 
                        'frontend/dev/js/app/controllers/*.js', 
                        'frontend/dev/js/app/directives/*.js'
                    ],
                },
            },
        },
        jade: {
            compile: {
                options: {
                    client: false
                },
                files: [ {
                    cwd: "frontend/dev/views",
                    src: "**/*.jade",
                    dest: "frontend/views",
                    expand: true,
                    ext: ".html"
                } ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('devmode', ['watch']);
};