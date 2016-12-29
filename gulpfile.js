var gulp          = require('gulp'),
    babel         = require('gulp-babel'),
    uglify        = require('gulp-uglify'),
    wrapCommonjs  = require('gulp-wrap-commonjs'),
    concat        = require('gulp-concat'),
    jshint        = require('gulp-jshint'),
    changed       = require('gulp-changed'),
    imagemin      = require('gulp-imagemin'),
    minifyHTML    = require('gulp-minify-html'),
    autoprefix    = require('gulp-autoprefixer'),
    minifyCSS     = require('gulp-minify-css'),
    webserver     = require('gulp-webserver');

var _paths = {
  jsSrcPath: [
    './src/scripts/controllers.js',
    './src/scripts/helpers.js',
    './src/scripts/models.js',
    './src/scripts/services.js',
    './src/scripts/utils.js'
  ],
  jsDstPath   : './build/scripts/',
  cssSrcPath  : './src/styles/*.css',
  cssDstPath  : './build/styles/',
  htmlSrcPath : './src/*.html',
  htmlDstPath : './build',
  imgSrcPath  : './src/images/**/*',
  imgDstPath  : './build/images'
};

var _jsOutFile = 'script.js';
var _cssOutFile = 'styles.css';

gulp.task('jshint', function() {
  gulp.src(_paths.jsSrcPath)
    .pipe(jshint({ esnext: true }))
    .pipe(jshint.reporter('default'))
});

gulp.task('imagemin', function() {
  gulp.src(_paths.imgSrcPath)
    .pipe(changed(_paths.imgDstPath))
    .pipe(imagemin())
    .pipe(gulp.dest(_paths.imgDstPath))
});

gulp.task('htmlpage', function() {
  gulp.src(_paths.htmlSrcPath)
    .pipe(changed(_paths.htmlDstPath))
    .pipe(minifyHTML())
    .pipe(gulp.dest(_paths.htmlDstPath));
});

gulp.task('commonjs', function() {
  gulp.src(['./src/scripts/commonjs-required.js'])
    .pipe(uglify())
    .pipe(concat('commonjs-required.js'))
    .pipe(gulp.dest(_paths.jsDstPath))
})

gulp.task('scripts', function() {
  gulp.src(_paths.jsSrcPath)
    .pipe(babel({presets: ['es2015']}))
    .pipe(
      wrapCommonjs({
        pathModifier: function (path) {
          path = path.replace(/.js$/, '')
          return path;
        },
        relativePath: './src/scripts/'
      })
    )
    .pipe(uglify())
    .pipe(concat(_jsOutFile))
    .pipe(gulp.dest(_paths.jsDstPath));
});

gulp.task('styles', function() {
  gulp.src([_paths.cssSrcPath])
    .pipe(concat(_cssOutFile))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(_paths.cssDstPath));
});

gulp.task('webserver', function() {
  gulp.src('./build/')
    .pipe(webserver({
      port: 3000,
      livereload: true,
      open: true,
      fallback: './build/index.html'
    }));
});

gulp.task('default', ['imagemin', 'htmlpage', 'styles', 'scripts', 'commonjs', 'webserver'], function() {
  gulp.watch(_paths.htmlSrcPath, ['htmlpage']);
  gulp.watch(_paths.jsSrcPath, ['jshint', 'scripts']);
  gulp.watch(_paths.cssSrcPath, ['styles']);
  gulp.watch(_paths.imgSrcPath, ['imagemin']);
});

