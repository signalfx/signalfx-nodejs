'use strict';
var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var nsp = require('gulp-nsp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

exports.nsp = function (cb) {
  nsp('package.json', cb);
};

exports.browserify = function () {
  //todo : minify
  return browserify('./lib/signalfx_browser.js', { standalone: 'signalfx.streamer' })
    .exclude('bufferutil')
    .exclude('utf-8-validate')
    //do NOT bundle websockets because the browser will provide it
    .exclude('ws')
    .bundle()
    .pipe(source('signalfx.js'))
    .pipe(gulp.dest('./build/'));
};

exports.default = gulp.series(browserify);
