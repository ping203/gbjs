var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;
var config = require('./config');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass'),
	path = require('path'),
	args = require('minimist')(process.argv.slice(2));

var theme    = args.theme || 'gb-web';



gulp.task('build.dev', function () {
  var target = gulp.src(config.source.concat([
    '!src/**/*.spec.js'
  ]));
  return target.pipe(concat('gbjs.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build.tpl', function() {
  return gulp.src('src/themes/'+theme+'/**/*.html')
   .pipe(templateCache({
     templateHeader: "(function() { window.TWIST = window.TWIST || {}; TWIST.HTMLTemplate = {",
     templateBody: "\'<%= url %>\':\'<%= contents %>\'",
     templateFooter: "})();",
   }))
   .pipe(gulp.dest('dist/themes/' + theme));
});

gulp.task('build.scss', function() {
  return gulp.src('src/themes/'+theme+'/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/themes/'+theme));
});


gulp.task('build.js', function () {
  var target = gulp.src(config.source.concat([
    '!src/**/*.spec.js'
  ]));
  return target.pipe(concat('gbjs.min.js'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy.scss', function() {
  return gulp.src('src/themes/'+theme+'/sass/**/**.scss')
    .pipe(gulp.dest('dist/themes/'+theme+'/sass/'));
});


gulp.task('copy.images', function() {
  return gulp.src('src/themes/'+theme+'/images/**/*')
    .pipe(gulp.dest('dist/themes/'+theme+'/images/'));
});



gulp.task('build', [
	'build.scss',
	'build.tpl',
	'copy.scss',
	'copy.images',
	'build.js',
]);

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('watch', function () {
    gulp.watch(config.source, ['build.dev']);
    gulp.watch('src/themes/**/*.html', ['build.tpl']);
		gulp.watch('src/themes/**/*.scss', ['build.scss']);
});
