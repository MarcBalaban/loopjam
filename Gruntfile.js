'use strict'

module.exports = function (grunt) {
   // var localConfig;
   // try {
   //  localConfig = require('./server/config/local.env');
   //  } catch(e) {
   //    localConfig = {};
   //  }

  //Begin initConfig

  grunt.initConfig({
   pkg: grunt.file.readJSON('package.json'),
    //Set up tasks
    express: {
      options: {
        port: process.env.PORT || 3000
      },
      dev : {
        options: {
          script: './server.js'
        }
      },
      prod: {
        options: {
          script: './server.js',
          node_env: 'production'
        }
      }
    },

    jshint: {
      options: {
        jshintrc :'.jshintrc'
      },
      files: ['client/src/server.js']
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
      },
      unit: {
        singleRun: true
      },
      continuous:{
        background:true,
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS']
      },
      travis:{
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    nodemon: {
      dev: {
        script: './server.js'
      }
    },
    open: {
      dev: {
        path: 'http://localhost:3000/',
        server: 'Google Chrome'
      }
    },
    watch: {
      express: {
        files: ['./server.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false,
        }
      }
    },
    shell: {
      prodServer: {
        command: 'git push azure master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    }
  });

  //Load Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-karma');

  //Server Development
  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
  });

    //Register Unit Tasks

  grunt.registerTask('build', ['express:prod']);
  grunt.registerTask('default', [ 'express:dev', 'watch','nodemon','karma:unit']);
  grunt.registerTask('unit-test', ['karma:unit']);
  //Initiated in scripts line in package.json
  grunt.registerTask('test', ['jshint', 'express:dev']);
}