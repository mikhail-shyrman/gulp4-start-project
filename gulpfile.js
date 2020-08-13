var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglifyjs = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var tinypng = require('gulp-tinypng-compress');

sass.compiler = require('node-sass');

gulp.task('css', function(){
	return gulp.src('app/css/libs.css')
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano())
	.pipe(gulp.dest('app/css'))
})

gulp.task('script', function() {
	return gulp.src(['app/libs/',
					 'app/libs/'])
	.pipe(concat('libs.min.js'))
	.pipe(uglifyjs())
	.pipe(gulp.dest('app/js'))
});
 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });

    gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
    gulp.watch('app/js/*.js').on('change', browserSync.reload);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src('app/sass/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('img', function (done) {
    gulp.src('app/img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'D7HN9g6wPg5yW6hHx6H7Xc36SyjDhqWZ'
        }))
        .pipe(gulp.dest('dist/img'));
        done();
});

gulp.task('build', async function() {
	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'))

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/*.js')
		.pipe(gulp.dest('dist/js'))

	var buildCss = gulp.src(['app/css/*.css','!app/css/libs.css'])
		.pipe(gulp.dest('dist/css'))

	var buildImg = gulp.src('app/img/**/*.{png,jpg,jpeg,svg}')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', gulp.series('browser-sync'));

