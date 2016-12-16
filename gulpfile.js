var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;
var sourcemaps = require('gulp-sourcemaps');
var config = require('./config');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass'),
	path = require('path'),
	args = require('minimist')(process.argv.slice(2));

var theme = args.theme || 'jarvanIV';

console.log("theme",theme);

gulp.task('build.tpl', function() {
  return gulp.src('src/themes/'+theme+'/tpl/**/*.html')
   .pipe(templateCache({
     templateHeader: ";(function() { window.TWIST = window.TWIST || {}; TWIST.HTMLTemplate = {",
     templateBody: "\'<%= url %>\':\'<%= contents %>\',",
     templateFooter: "}})();",
     transformUrl: function(url) {
        return url.replace(/.html$/, '');
    }
   }))
   .pipe(gulp.dest('dist/themes/' + theme))
   .pipe(gulp.dest('src/display/'));
});

gulp.task('build.sound', function() {
  return gulp.src('src/themes/'+theme+'/sounds/**/*.ogg')
   .pipe(templateCache({
     templateHeader: "p._sounds = [",
     templateBody: "{id : \'<%= url %>\', src : \'<%= url %>.ogg\'},",
     templateFooter: "]",
     transformUrl: function(url) {
        return url.replace(/.ogg/, '');
    }
   }))
   .pipe(gulp.dest('dist/sounds'))
   .pipe(concat('sounds.js'));
});

gulp.task('build.scss', function() {
  return gulp.src('src/themes/'+theme+'/sass/main.scss')
//    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
//    .pipe(sourcemaps.write())
//    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/themes/'+theme));
});

gulp.task('build.dev', function () {
  var target = gulp.src(config.source.concat([
    '!src/**/*.spec.js'
  ]));
  return target.pipe(concat('gbjs.js'))
    .pipe(gulp.dest('./dist'));
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


gulp.task('copy.sounds', function() {
  return gulp.src('src/themes/'+theme+'/sounds/**/*')
    .pipe(gulp.dest('dist/themes/'+theme+'/sounds/'));
});



gulp.task('build', [
	'build.scss',
	'build.tpl',
	'copy.scss',
	'copy.images',
	'copy.sounds',
	'build.js',
        'build.dev'
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
    gulp.watch('src/themes/'+theme+'/**/*.html', ['build.tpl']);
    gulp.watch('src/themes/'+theme+'/**/*.scss', ['build.scss']);
});
