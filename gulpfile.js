var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var gulp = require('gulp');
var browserify = require('browserify');
var source =require('vinyl-source-stream');
var exec = require('child_process').exec;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var git = require('gulp-git');
var gitignore = require('gulp-gitignore');
var fs = require('fs');
var wait = require('gulp-wait');
var buildProduction = utilities.env.production;
var map = require('map-stream');
buildable = true;

gulp.task('lint', function() {
  var isBuildable = map(function (file, cb) {
    if (!file.jshint.success) {
      console.error('jshint failed');
      buildable = false;
    }
  });
  gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(isBuildable);
});

gulp.task('concatInterface', ['lint'], function() {
  return gulp.src(['./js/*-interface.js'])
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('cssBuild')
});

gulp.task('jsBuild', ['jsBrowserify'], function() {
  browserSync.reload();
  gulp.start('gitStatus');
});

gulp.task('jsConditionalBuild', ['lint'], function() {
  wait(200);
  console.log(buildable);
  if(buildable) {
    gulp.start('jsBuild');
  } else {
    buildable = true;
  }
});

gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
  gulp.start('gitStatus');
});

gulp.task('htmlBuild', function() {
  browserSync.reload();
  gulp.start('gitStatus');
});

gulp.task('autoServe', function() {
  exec('./serve.sh', function(err, stdout, stderr) {
    utilities.log(stdout, stderr);
  });

});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
  gulp.watch("scss/*scss", ['cssBuild']);
  gulp.watch("message.txt", ['gitCommit']);
  gulp.watch(["*"], ["gitStatus"]);
});

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('cssBuild', function() {
  return gulp.src('scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('gitAdd', function(){
  return gulp.src('./*')
  .pipe(gitignore())
  .pipe(git.add());
});

gulp.task('gitCommit', ['gitAdd'], function(){
  var message = fs.readFileSync("./message.txt");
  return gulp.src('./*')
    .pipe(gitignore())
    .pipe(git.commit(message, {
      disableAppendPaths: true
    }));
});

gulp.task('gitStatus', function() {
  git.status({args: '--porcelain'}, function (err, stdout) {
    if(err) throw err;
  });
});
