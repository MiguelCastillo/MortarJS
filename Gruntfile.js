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
            "mortar": "src"
          },
          name: 'lib/js/almond',
          include: ['mortar/core'],
          out: 'dist/mortar-debug.js',
          optimize: "none",
          preserveLicenseComments: true,
          wrap: {
              startFile: ['buildinfo/license.frag', 'buildinfo/start.frag'],
              endFile: 'buildinfo/end.frag'
          }
        }
      },
      minified: {
        options: {
          baseUrl: '.',
          paths: {
            "mortar": "src"
          },
          name: 'lib/js/almond',
          include: ['mortar/core'],
          out: 'dist/mortar-min.js',
          optimize: "uglify",
          preserveLicenseComments: true,
          wrap: {
              startFile: ['buildinfo/license.frag', 'buildinfo/start.frag'],
              endFile: 'buildinfo/end.frag'
          }
        }
      },
      amddebug: {
        options: {
          baseUrl: '.',
          paths: {
            "mortar": "src"
          },
          include: ['mortar/core'],
          out: 'dist/mortar-amd-debug.js',
          optimize: "none",
          preserveLicenseComments: true,
          wrap: {
              startFile: 'buildinfo/license.frag'
          }
        }
      },
      amdminified: {
        options: {
          baseUrl: '.',
          paths: {
            "mortar": "src"
          },
          include: ['mortar/core'],
          out: 'dist/mortar-amd-min.js',
          optimize: "uglify",
          preserveLicenseComments: true,
          wrap: {
              startFile: 'buildinfo/license.frag'
          }
        }
      }
    },
    jasmine: {
      all: {
        src: "dist/mortar.js",
        options: {
          specs: "tests/*.js"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['requirejs']);
  grunt.registerTask('build', ['requirejs']);
  grunt.registerTask('tests', ['jasmine']);
};
