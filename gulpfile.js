var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var minifyHTML  = require('gulp-minify-html');
var concat      = require('gulp-concat');
var stripDebug  = require('gulp-strip-debug');
var uglify      = require('gulp-uglify');
var autoprefix  = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-minify-css');
var webserver   = require('gulp-webserver');

gulp.task('jshint', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst))
});

gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

gulp.task('scripts', function() {
  var jsOutFile = 'script.js',
      jsSrc = './src/scripts/*.js',
      jsDst = './build/scripts/';

  gulp.src([jsSrc])
    .pipe(concat(jsOutFile))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(jsDst));
});

gulp.task('styles', function() {
  var cssOutFile = 'styles.css',
      cssSrc = './src/styles/*.css',
      cssDst = './build/styles/';
  
  gulp.src([cssSrc])
    .pipe(concat(cssOutFile))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDst));
});

gulp.task('webserver', function() {
  gulp.src('./src/')
    .pipe(webserver({
      port: 3000,
      livereload: true,
      open: true,
      fallback: './src/index.html'
    }));
});

gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles', 'webserver'], function() {
  var htmlSrc = './src/*.html',
      jsSrc = './src/scripts/*.js',
      cssSrc = './src/styles/*.css',
      imgSrc = './src/images/**/*';  

  gulp.watch(htmlSrc, ['htmlpage']);
  gulp.watch(jsSrc, ['jshint', 'scripts']);
  gulp.watch(cssSrc, ['styles']);
  gulp.watch(imgSrc, ['imagemin']);
});

