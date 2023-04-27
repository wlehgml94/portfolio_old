const gulp = require('gulp');
const Fiber = require('fibers');
const dartSass = require('dart-sass');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postCss = require('gulp-postcss');
const fileinclude = require('gulp-file-include');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const del = require('del');
const dependents = require('gulp-dependents');
const cached = require('gulp-cached');
const path = require('path'); 
const plumber  = require('gulp-plumber');

const apfBrwsowsers = [
  'ie > 0', 'chrome > 0', 'firefox > 0'  // 브라우저의 모든 버전 적용
  //'last 2 versions'                    // 최신 브라우저 기준 하위 2개의 버전까지 적용
];
const PATH = {
  HTML: 'workspace/html',
  ASSETS: {
    FONTS: './workspace/assets/fonts',
    IMAGES: './workspace/assets/img',
    STYLE: './workspace/assets/css',
    SCRIPT: './workspace/assets/js',
    LIB: './workspace/assets/lib',
    VEDIO: './workspace/assets/video',
  }
},
DEST_PATH = {
  HTML: './dist',
  ASSETS: {
    FONTS: './dist/assets/fonts',
    IMAGES: './dist/assets/img',
    STYLE: './dist/assets/css',
    SCRIPT: './dist/assets/js',
    LIB: './dist/assets/lib',
    VEDIO: './dist/assets/video',
  }
};
const onErrorHandler = (error) => console.log(error);

gulp.task('scss:compile', () => {
  return new Promise(resolve => {
    var options = {
      scss: {
        outputStyle: 'compressed', //nested(default), expanded, compact, compressed
        indentType: 'space', //space, tab
        indentWidth: 2,
        precision: 8,
        sourceComments: true,
        compiler: dartSass,
        fiber: Fiber
      },
      postcss: [ autoprefixer({
        overrideBrowserslist: apfBrwsowsers,
      }) ]
    };
    gulp.src(
        PATH.ASSETS.STYLE + '/*.scss',
        {since: gulp.lastRun('scss:compile')} 
      )
      .pipe(plumber({errorHandler:onErrorHandler}))
      .pipe(dependents())
      .pipe(sourcemaps.init())
      //.pipe(concat('common.css'))
      .pipe(scss(options.scss).on('error', scss.logError))
      .pipe(postCss(options.postcss))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE))
      .pipe(browserSync.reload({stream: true}));
    resolve();
  }); 
});

gulp.task('html', () => {
  return new Promise(resolve => {
    gulp.src([
        PATH.HTML + '/*',
        '!' + PATH.HTML + '/include*'
      ])
      .pipe(plumber({errorHandler:onErrorHandler}))
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      }))
      .pipe(cached('html'))
      .pipe(gulp.dest(DEST_PATH.HTML))
      .pipe(browserSync.reload({stream: true}));
    resolve();
  });
});

gulp.task('script:build', () => {
  return new Promise(resolve => {
    gulp.src([PATH.ASSETS.SCRIPT + '/*.js'])
      .pipe(plumber({errorHandler:onErrorHandler}))
      .pipe(concat('common.js'))
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(uglify({
        mangle: true
      }))
      .pipe(rename('common.min.js'))
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(browserSync.reload({stream: true}));
    resolve();
  })
});

gulp.task('library', () => {
  return new Promise(resolve => {
    gulp.src(PATH.ASSETS.LIB + '/*.*')
      .pipe(gulp.dest( DEST_PATH.ASSETS.LIB));
    resolve();
  });
});
gulp.task('vedioo', () => {
  return new Promise(resolve => {
    gulp.src(PATH.ASSETS.VEDIO + '/*.*')
      .pipe(gulp.dest( DEST_PATH.ASSETS.VEDIO));
    resolve();
  });
});
gulp.task('imagemin', () => {
  return new Promise(resolve => {
    gulp.src([PATH.ASSETS.IMAGES + '/*.*', PATH.ASSETS.IMAGES + '/**/*.*'])
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: false}),
        imagemin.mozjpeg({progressive: false}),
        imagemin.optipng({optimizationLevel: 2}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
      .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
      //.pipe(browserSync.reload({stream: true}));
    resolve();
  });
});

gulp.task('fonts', () => {
  return new Promise(resolve => {
    gulp.src(PATH.ASSETS.FONTS + '/*.*')
      .pipe(gulp.dest(DEST_PATH.ASSETS.FONTS)
    );
    resolve();
  });
});

gulp.task('nodemon:start', () => {
  return new Promise(resolve => {
    nodemon({
      script: 'app.js',
      watch: 'app'
    });
    resolve();
  });
});

gulp.task('watch', () => {
  return new Promise(resolve => {
    const html_watcher = gulp.watch([PATH.HTML + '/**/*.html', PATH.HTML + '/**/**/*.html'], gulp.series(['html']));
    const scss_watcher = gulp.watch(PATH.ASSETS.STYLE + '/**/*.scss', gulp.series(['scss:compile']));
    file_management(html_watcher, PATH.HTML, DEST_PATH.HTML);
    file_management(scss_watcher, PATH.ASSETS.CSS, DEST_PATH.ASSETS.CSS); 
    gulp.watch(PATH.ASSETS.SCRIPT + '/*.js', gulp.series(['script:build']));
    gulp.watch([PATH.ASSETS.IMAGES + '/*.*', PATH.ASSETS.IMAGES + '/**/*.*'], gulp.series(['imagemin']));
    resolve();
  });
});

const file_management = (watcher_target, src_path, dist_path) => {
  watcher_target.on('unlink', (filepath) => {
    const filePathFromSrc = path.relative(path.resolve(src_path), filepath);
    const extension_type = filePathFromSrc.split('.')[filePathFromSrc.split('.').length - 1];
    // scss 삭제 (min파일까지 생성했을 때)
    if (extension_type === 'scss'){
      const destFilePath_css = path.resolve(dist_path, filePathFromSrc).replace('scss','css');
      del.sync(destFilePath_css);
      const destFilePath_minCss = path.resolve(dist_path, filePathFromSrc).replace('scss','min.css');
      del.sync(destFilePath_minCss);
    }
    // scss 외 파일 삭제
    else {
      const destFilePath = path.resolve(dist_path, filePathFromSrc);
      del.sync(destFilePath);
    }
  });
}

gulp.task('clean', () => {
  return new Promise(resolve => {
    del.sync(DEST_PATH.HTML, {force:true});
    resolve();
  });
});

gulp.task('browserSync', () => {
  return new Promise(resolve => {
    browserSync.init(null, {
      proxy: 'http://localhost:3000',
      port: 3001
    });
    resolve();
  });
});

gulp.task('default',
  gulp.series([
    'clean',
    'scss:compile',
    'html',
    'script:build',
    'library',
    'vedioo',
    'imagemin',
    'fonts',
    'nodemon:start',
    'browserSync',
    'watch'
  ])
);

