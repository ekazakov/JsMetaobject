var gulp = require('gulp');

var gutil      = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var watchify   = require("watchify");
var browserify = require("browserify");
var source     = require("vinyl-source-stream");
var buffer     = require("vinyl-buffer");
var _          = require("lodash");

var bundler = watchify(browserify('./src/index.js', watchify.args));

bundler.on('update', bundle);

function bundle () {
    return bundle.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    ;
}
