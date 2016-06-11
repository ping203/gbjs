module.exports = function(config) {
  config.set({
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    frameworks: ['jasmine'],
    browserDisconnectTimeout:500,
    logLevel: 'warn',
    files: [
    	'bower_components/EaselJS/lib/easeljs-0.8.2.min.js',
    	'bower_components/TweenJS/lib/tweenjs-0.6.2.min.js',
    	'bower_components/SoundJS/lib/soundjs-0.6.2.min.js',
    	'bower_components/PreloadJS/lib/preloadjs-0.6.2.min.js',
    	'bower_components/underscore/underscore-min.js',
      'src/**/*.js',
      'src/**/*.spec.js',
    ]
  });
};