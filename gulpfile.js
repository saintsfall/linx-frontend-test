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
    .src("src/assets/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.stream());
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
}

// Exporting tasks
exports.htmlMin = htmlMin;
exports.compileSass = compileSass;
exports.watch = watch;
