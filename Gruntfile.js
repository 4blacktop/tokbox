module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: "\n\n"
            },
            dist: {
                src: ['js/*.js'],
                dest: 'www/js/all.js'
            } 
        },

        uglify: {
            main: {
                files: {
                    'www/js/all.min.js' : ['www/js/all.js'],
                }
            }
        },

        sass: {
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: true
                },
                files: {
                    'www/css/main-unprefixed.css' : 'scss/main.scss'
                }
            }
        },

        autoprefixer: {
            main: {
                src: "www/css/main-unprefixed.css",
                dest: "www/css/main.css"
            },
            options: {
                map: true
            }
        },

        po2json: {
            options: {
                format: 'raw'
            },
            all: {
                src: ['www/assets/locale/zh_CN/default.po'],
                dest: 'www/assets/locale/zh_CN/'
            }
        },

        watch: {
            stylesheets: {
                files: ['scss/**/*.scss'],
                tasks: ['sass', 'autoprefixer'],
			    options: {
			        spawn: false,
				},
            },
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['concat', 'uglify'],
			    options: {
			        spawn: false,
				},
            },
            po: {
                files: ['www/assets/locale/zh_CN/default.po'],
                tasks: ['po2json'],
			    options: {
			        spawn: false,
				},
            },
            grunt: { 
                files: ['Gruntfile.js'] ,
			    options: {
			        spawn: false,
				},
            },
            site: {
                files: ['www/**/*.php'],
			    options: {
			        spawn: false,
				},
            },
            options: {
                spawn: false,
                livereload: true
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    // Define the tasks
    grunt.registerTask('default', ['sass', 'autoprefixer', 'concat', 'uglify', 'po2json', 'watch']);
}