var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('build', function () {
  var target = gulp.src('./src/**/*.js');
  return target.pipe(concat('gbjs.min.js'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('./dist'));
});
