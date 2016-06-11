var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;




gulp.task('build', function () {
  var target = gulp.src('./src/**/*.js');
  return target.pipe(concat('gbjs.min.js'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('./dist'));
});






/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});