'use strict';

var Fiber = require('fibers');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var cssbeautify = require('gulp-cssbeautify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var options = require('gulp-options');
var rsync = require('gulp-rsync');
var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');

sass.compiler = require('sass');

var dirSrc = 'src';
var dirBuild = 'build';

var routes = {
	watch: {
		root: dirSrc,
		assets: {
			favicon: dirSrc + '/favicon/*',
			fonts: dirSrc + '/fonts/**/*',
			img: dirSrc + '/img/**/*'
		},
		html: dirSrc + '/**/*.html',
		js: dirSrc + '/js/**/*.js',
		jsESLint: [dirSrc + '/js/**/*.js', '!' + dirSrc + '/js/libs/*.js'],
		css: dirSrc + '/css/**/*.css',
		sass: dirSrc + '/scss/**/*.scss',
		sassStylelint: [
			dirSrc + '/scss/**/*.scss',
			'!' + dirSrc + '/scss/libs/*.scss'
		]
	},
	dev: {
		root: dirSrc,
		js: dirSrc + '/js',
		css: dirSrc + '/css'
	},
	build: {
		root: dirBuild,
		files: dirBuild + '/**/*',
		assets: {
			favicon: dirBuild + '/favicon',
			fonts: dirBuild + '/fonts',
			img: dirBuild + '/img'
		},
		html: dirBuild,
		js: dirBuild + '/js',
		css: dirBuild + '/css'
	}
};

function browser() {
	browserSync.init({
		server: { baseDir: dirSrc },
		notify: false
	});
}

function devSassStyleLint() {
	return gulp.src(routes.watch.sassStylelint).pipe(
		// Проверка sass линтами
		stylelint({
			reporters: [{ formatter: 'string', console: true }]
		}).on('error', notify.onError())
	); // Обновление страницы
}

function devSass() {
	return gulp
		.src(routes.watch.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({ fiber: Fiber }).on('error', notify.onError())) // Преобразование sass в css
		.pipe(autoprefixer(['last 15 versions'])) // Добавление префиксов
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(routes.dev.css)) // Перемещение в папку css
		.pipe(browserSync.stream()); // Обновление страницы
}

function devJs() {
	return gulp
		.src(routes.watch.jsESLint)
		.pipe(
			// Проверка линтом
			eslint({
				globals: ['jQuery', '$']
			})
		)
		.pipe(eslint.format()) // Вывод ошибок в консоль
		.pipe(browserSync.reload({ stream: true }));
}

function devHtml() {
	return gulp.src(routes.watch.html).pipe(browserSync.reload({ stream: true }));
}

var isNoMinCss = function (file) {
	return !options.has('no-min') && file.basename.indexOf('.min.css') === -1;
};

function buildCss() {
	return gulp
		.src(routes.watch.css)
		.pipe(gulpif(isNoMinCss, cleanCSS(), cssbeautify({ indent: '	' }))) // Минификация кода
		.pipe(gulpif(isNoMinCss, rename({ suffix: '.min', prefix: '' }))) // Добавление суффикса .min к названию файла
		.pipe(gulp.dest(routes.build.css)); // Перемещение в папку build
}

var isNoMinJs = function (file) {
	return !options.has('no-min') && file.basename.indexOf('.min.js') === -1;
};

function buildJs() {
	return gulp
		.src(routes.watch.js)
		.pipe(gulpif(isNoMinJs, uglify())) // Минификация кода
		.pipe(gulpif(isNoMinJs, rename({ suffix: '.min', prefix: '' }))) // Добавление суффикса .min к названию файла
		.pipe(gulp.dest(routes.build.js)); // Перемещение в папку build
}

function buildHtml() {
	return gulp
		.src(routes.watch.html)
		.pipe(
			gulpif(
				!options.has('no-min'),
				// eslint-disable-next-line no-useless-escape
				replace(/(src|href)=\".+(\.css|\.js)\"/g, function (match) {
					var res = match;
					if (match.indexOf('.js') !== -1) {
						if (match.indexOf('.min.js') === -1) {
							res = match.replace(/\.js/g, '.min.js');
						}
					}
					if (match.indexOf('.css') !== -1) {
						if (match.indexOf('.min.css') === -1) {
							res = match.replace(/\.css/g, '.min.css');
						}
					}
					return res;
				})
			)
		)
		.pipe(gulp.dest(routes.build.html)); // Перемещение в папку build
}

function buildAssetsFavicon() {
	return gulp
		.src(routes.watch.assets.favicon)
		.pipe(gulp.dest(routes.build.assets.favicon)); // Перемещение в папку build
}

function buildAssetsFonts() {
	return gulp
		.src(routes.watch.assets.fonts)
		.pipe(gulp.dest(routes.build.assets.fonts)); // Перемещение в папку build
}

function buildAssetsImg() {
	return gulp
		.src(routes.watch.assets.img)
		.pipe(gulp.dest(routes.build.assets.img)); // Перемещение в папку build
}

function watcher() {
	gulp.watch(routes.watch.sass, gulp.parallel(devSassStyleLint, devSass));
	gulp.watch(routes.watch.js, devJs);
	gulp.watch(routes.watch.html, devHtml);
}

function deploy() {
	return gulp.src(routes.build.files).pipe(
		rsync({
			root: routes.build.root,
			hostname: 'www-root@80.78.240.209',
			destination: 'www/test.grechka.digital/kassa/',
			// include: ['*.htaccess'], // Included files
			exclude: ['**/Thumbs.db', '**/*.DS_Store'],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		})
	);
}

exports.build = gulp.series(
	buildAssetsFavicon,
	buildAssetsFonts,
	buildAssetsImg,
	buildHtml,
	buildJs,
	devSass,
	buildCss
);

exports.deploy = deploy;

exports.default = gulp.parallel(
	devSassStyleLint,
	devSass,
	devJs,
	browser,
	watcher
);
