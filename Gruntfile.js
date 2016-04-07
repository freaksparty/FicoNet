module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            jade: {
                files: "views/**/*.jade",
                tasks: ["jade"]
            }
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