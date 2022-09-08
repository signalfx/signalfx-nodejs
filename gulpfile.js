'use strict';
var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

exports.nsp = function (cb) {
  nsp('package.json', cb);
};

function preTest() {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
}

function test(cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'})) // nyan
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
}

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

exports.prepublish = function prepublish(cb) {
  cb();
};
exports.test = gulp.series(preTest, test);
exports.default = gulp.series(test);
