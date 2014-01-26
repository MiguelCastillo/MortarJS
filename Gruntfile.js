//
// http://24ways.org/2013/grunt-is-not-weird-and-hard/
//
module.exports = function(grunt) {

  var Browser = require("zombie");

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
          },

          name: 'lib/js/almond',
          include: ['src/mortar'],
          out: 'dist/mortar-debug.js',

          optimize: 'none',
          preserveLicenseComments: true,
          wrap: {
            startFile: ['buildinfo/license.frag', 'buildinfo/module-start.frag'],
            endFile: 'buildinfo/module-end.frag'
          }
        }
      },
      minify: {
        options: {
          baseUrl: '.',
          paths: {
          },

          name: 'lib/js/almond',
          include: ['src/mortar'],
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
    rjasmine: {
      anything: {

      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'tests/specs/*.js'],
        tasks: ['rjasmine'],
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

  grunt.registerTask('rjasmine', 'unit tests', function() {
    // Load the page from localhost
    browser = new Browser();
    //browser.visit("file://" + __dirname + "/tests.html", { silent: false });
    browser.visit("http://mcastillo_macbook/MortarJs/tests.html", { silent: false });
  });

  grunt.registerTask('default', ['requirejs']);
  grunt.registerTask('dev', ['watch']);
};
