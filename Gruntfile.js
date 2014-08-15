module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    "<%= pkg.name %>.min.js": ["<%= pkg.name %>.js"]
                }
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %>.js v<%= pkg.version %> | (c) ' + grunt.template.today("yyyy") +
                    ' Kyle Paulsen, jQuery Foundation, Inc. and other contributors | jquery.org/license */\n'
            },
            dist: {
                src: ['<%= pkg.name %>.min.js'],
                dest: '<%= pkg.name %>.min.js',
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask("default", ["uglify", "concat"]);
};
