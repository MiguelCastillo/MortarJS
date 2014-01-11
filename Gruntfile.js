//
// http://24ways.org/2013/grunt-is-not-weird-and-hard/
//
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'src/*.js'
        ],
        dest: 'dist/mortar.js',
      }
    },
    jshint: {
      config: {
        options: {jshintrc: '.jshintrc'},
        src: ['src/*.js'],
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '.',
          paths: {
            mortar: 'src'
          },
          name: 'lib/js/almond',
          include: ['mortar/core'],
          out: 'dist/mortar-debug.js',
          optimize: 'none',
          preserveLicenseComments: true,
          wrap: {
            startFile: ['buildinfo/license.frag', 'buildinfo/module-start.frag'],
            endFile: 'buildinfo/module-end.frag'
          }
        }
      },
      minified: {
        options: {
          baseUrl: '.',
          paths: {
            mortar: 'src'
          },
          name: 'lib/js/almond',
          include: ['mortar/core'],
          out: 'dist/mortar.js',
          optimize: 'uglify',
          preserveLicenseComments: true,
          wrap: {
            startFile: ['buildinfo/license.frag', 'buildinfo/module-start.frag'],
            endFile: 'buildinfo/module-end.frag'
          }
        }
      }
    },
    jasmine: {
      all: {
        options: {
          specs: ["tests/specs/*.js"],
          helpers: ["lib/js/jquery-1.10.1.js", "lib/js/underscore.js"],
          template: require("grunt-template-jasmine-requirejs"),
          templateOptions: {
            requireConfig: {
              "paths": {
                "mortar": "src",
                "underscore": "lib/js/underscore",
                "jquery": "lib/js/jquery-1.10.1",
                "rivets": "lib/js/rivets",
                "ko": "lib/js/knockout-3.0.0"
              }
            }
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'tests/specs/*.js'],
        //tasks: ['jasmine'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['requirejs']);
  grunt.registerTask('dev', ['watch']);
};
