var gulp = require('gulp');

var path = require('path')
var gutil      = require("gulp-util");
// var sourcemaps = require("gulp-sourcemaps");
var watchify   = require("watchify");
var browserify = require("browserify");
var transform = require('vinyl-transform');
// var source     = require("vinyl-source-stream");
// var buffer     = require("vinyl-buffer");
var _          = require("lodash");

var filename = path.join(__dirname, 'tests/index.js');

gulp.task('default', function () {
    rebundle();
});

var bundler = watchify(browserify(filename, watchify.args));

bundler.on('update', rebundle);
bundler.on('log', gutil.log);


function rebundle (files) {
    gutil.log('changed files:', files);
    var bundle = transform(function () {
        return bundler.bundle();
    });

    return gulp.src(filename)
        .pipe(bundle)
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(gulp.dest('js'))
    ;
}
