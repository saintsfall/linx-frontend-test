const gulp = require("gulp");
const sass = require("gulp-sass");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();

gulp.task("default", gulp.series(watch));

// FUNCTIONS
function htmlMin() {
  return gulp
    .src("src/index.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("dist"));
}

// Compile SASS/SCSS to CSS
function compileSass() {
  return gulp
    .src("src/assets/sass/style.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
}

// Compile JS
async function compileJs(done) {
  gulp.src("src/assets/scripts/*.js").pipe(gulp.dest("dist/")).pipe(browserSync.stream());
  done();
}

// WATCH
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch("./src/index.html", htmlMin);
  // Alternative for not minified html
  gulp.watch("./src/index.html").on("change", browserSync.reload);
  gulp.watch("./src/assets/**/*.scss", compileSass);
  gulp.watch("./src/assets/scripts/**/*.js", compileJs);
}

// Exporting tasks
exports.htmlMin = htmlMin;
exports.compileSass = compileSass;
exports.compileJs = compileJs;
exports.watch = watch;
