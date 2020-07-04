const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const assets = require("postcss-assets");
const sorting = require("postcss-sorting");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();

const paths = {
  root: "./command_collection/",
  html: {
    src: "./command_collection/**/*.html",
  },
  styles: {
    src: "./command_collection/assets/**/*.scss",
    dest: "./command_collection/assets",
  },
};

// autoprefixer
const autoprefixerOption = {
  cascade: false,
  grid: true,
};
const sortingOptions = require("./postcss-sorting.json");
const postcssOption = [
  assets({
    baseUrl: "/",
    basePath: "/",
    loadPaths: ["img/"],
    cachebuster: true,
  }),
  autoprefixer(autoprefixerOption),
  sorting(sortingOptions),
];

// styles
function styles() {
  return gulp
    .src(paths.styles.src, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "SCSS 失敗！",
          message: "<%= error.message %>",
          // sound: 'Frog'
        }),
      })
    )
    .pipe(
      sass({
        outputStyle: "expanded", // expanded, compressed
      })
    )
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: "./" }));
}

// browserSync
const browserSyncOption = {
  port: 8080,
  server: {
    baseDir: paths.root,
    index: "index.html",
  },
  reloadOnRestart: true,
};
function sync(done) {
  browserSync.init(browserSyncOption);
  done();
}

// watchFiles
function watchFiles(done) {
  const browserReload = () => {
    browserSync.reload();
    done();
  };

  gulp.watch(paths.html.src).on("change", gulp.series(browserReload));
  gulp
    .watch([paths.styles.src])
    .on("change", gulp.series(styles, browserReload));
}

// task default
gulp.task("default", gulp.series(sync, watchFiles));
