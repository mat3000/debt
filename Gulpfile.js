var gulp = require('gulp');

var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uniqid = require('uniqid').time();
var replace = require('gulp-string-replace');

var less = require('gulp-less');
var rename = require("gulp-rename");
var mcss = require('gulp-mcss');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');


// DEV

	// less : concat + autoprefix + minify
	gulp.task('less', () => {
	 	return gulp.src('./dev/public/styles/less/styles.less')
	 		.pipe(plumber({
	        	errorHandler: function (err) {
		            console.log(err);
		            this.emit('end');
		        }
		    }))
		    .pipe(less())
		    .pipe(rename("./bundle.css"))
		    .pipe(gulp.dest('./dev/public/styles'))
		    .pipe(livereload());
	});


	// webpack
	gulp.task('webpack', () => {

	 	return gulp.src(['./dev/public/js/app.js', '!./dev/public/js/bundle.js'])
	 		// .pipe(webpack(require('./webpack.config.js')))
		    .pipe(rename("./bundle.js"))
		    .pipe(gulp.dest('./dev/public/js'))
		    .pipe(livereload());

	});


	// html / php
	gulp.task('html', () => {
	 	return gulp.src(['./dev/**/*.html', './dev/**/*.php'])
		    .pipe(livereload());
	});


	// img
	gulp.task('img', () => {
	 	return gulp.src(['./dev/public/**/*'])
		    .pipe(livereload());
	});


	gulp.task('watch', () => {

		livereload.listen();

		gulp.watch('./dev/public/styles/less/**/*.less', ['less']);
		// gulp.watch('./public/js/**/*.js', ['webpack']);
		gulp.watch(['./dev/**/*.html', './dev/**/*.php'], ['html']);
		gulp.watch(['./dev/**/*.jpg', './dev/**/*.jpeg', './dev/**/*.gif', './dev/**/*.png', './dev/**/*.svg'], ['img']);

	});

	gulp.task('default', ['watch', 'less']);








// DIST
	
	// less
	gulp.task('less-dist', ['clean-dist'], () => {
	 	return gulp.src('./dev/public/styles/less/styles.less')
		    .pipe(less())
		    .pipe(rename("./min.css"))
	 		.pipe(gulpif('./min.css', postcss([
	        	autoprefixer({browsers: ['> 1%', 'last 2 versions']})
		    ])))
		    .pipe(mcss())
	    	.pipe(gulp.dest('./dist/public/styles'))
	});

	// html
	gulp.task('html-dist', ['clean-dist', 'less-dist'], () => {
	// gulp.task('html-dist', ['clean-dist'], () => {
	 	return gulp.src(['./dev/**/*.html', './dev/**/*.php', '!./node_modules/**/*', '!./dist/**/*', '!./dev/public/styles/**/*'])
	 		.pipe(useref({
	 			base: 'public',
	 			mylog: function (content, target, options, alternateSearchPath) {
	 				return "<script type=\"text/javascript\">(function(){var methods=['php','show','hide','info','loop','red','Red','orange','yellow','green','Green','blue','violet','white','grey','black','time','size','key','button','range'];var length=methods.length;window.log=window.log||{};while(length--){if(!log[methods[length]])log[methods[length]]=function(){};}})();</script>";
				},
				myjs: function(content, target, options, alternateSearchPath){
					return `<script type="text/javascript" src="${target}?${uniqid}"></script>`;
				},
				mycss: function(content, target, options, alternateSearchPath){
					return `<link rel="stylesheet" href="${target}?${uniqid}" />`;
				}
	 		}))
	 		.pipe(replace(/.*\/\*\sreplace\(.*\)\s\*\//g, function (replacement) {
	 			var fromto = replacement.replace(/^.*\(|\).*$/g, '').split(',');
	 			var from = fromto[0].replace(/\'/g, '').trim();
	 			var to = fromto[1].replace(/\'/g, '').trim();
	 			return replacement.replace(/\/\*.*\*\//g, '').replace(from, to);
			}))
		    .pipe(gulpif('**/*.js', gulp.dest('./dist/public')))
		    .pipe(gulpif('**/*.html', gulp.dest('./dist')))
		    .pipe(gulpif('**/*.php', gulp.dest('./dist')))
		    .pipe(gulpif('**/*.css', gulp.dest('./dist')))
	});

	// img
	gulp.task('img-dist', ['clean-dist'], () => {
	 	return gulp.src(['./dev/public/**/*.jpg', './dev/public/**/*.jpeg', './dev/public/**/*.gif', './dev/public/**/*.png', './dev/public/**/*.woff', './dev/public/**/*.woff2', './dev/public/**/*.ttf', './dev/public/**/*.svg', './dev/public/**/*.eot'])
		    .pipe(gulp.dest('./dist/public'));
	});

	// bordel
	gulp.task('core-dist', ['clean-dist'], () => {
	 	return gulp.src([
	 		'./dev/**/.htaccess',
	 		'./dev/**/./.htpasswd', 
	 		// './dev/**/robot.txt', 
	 		'./dev/**/favicon.*'
	 		])
		    .pipe(gulp.dest('./dist'));
	});

	// clean
	gulp.task('clean-dist', function () {
	    return gulp.src('./dist', {read: false})
	        .pipe(clean());
	});

	gulp.task('dist', [ 
		// 'clean-dist', 
		// 'less-dist',
		'html-dist', 
		'img-dist', 
		'core-dist'
	]);



















