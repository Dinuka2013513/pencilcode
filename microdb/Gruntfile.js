var os=require('os');

module.exports = function(grunt) {
  'use strict';
  
  
  var NO_PARSE = {};
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserify: {
      dist: {
        files: {
          'client/dist/micro-db.js': [
              'client/dev/micro-db-client.js',
              'client/dev/micro-db-client-server.js'
           ],
          'client/dist/micro-db-client.js': 'client/dev/micro-db-client.js',
          'client/dist/micro-db-client-server.js': 'client/dev/micro-db-client-server.js'
        },
        options: {
          browserifyOptions: {
            debug: false,
            noParse: NO_PARSE
          },
          watch: false,
          keepalive: false
        }
      },
      server: {
        files: {
          'client/dist/micro-db.js': 'client/dev/micro-db.js',
          'client/dist/micro-db-client-server.js': 'client/dev/micro-db-client-server.js'
        },
        options: {
          browserifyOptions: {
            debug: true,
            noParse: NO_PARSE
          },
          watch: true,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify:dist']);
};

