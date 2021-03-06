var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify');
var cdnizer = require("gulp-cdnizer");
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var inject = require("gulp-inject");
var awspublish = require('gulp-awspublish');
var process = require('child_process');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");

gulp.task('_partial_product_app',function(){
    return gulp.src([
        'src/**/*.html',
        '!src/app/sale_app/**/*.*'
    ])
    .pipe(ngHtml2Js({
        moduleName: "app.productApp.partial",
        rename:function(url){
            url = url.replace(/\//g, '.');//replace file path '/' into '.'
            return url;
        }
    }))
    .pipe(concat("product_app.partial.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('_partial_sale_app',function(){
    return gulp.src([
        'src/**/*.html',
        '!src/app/product_app/**/*.*'
    ])
    .pipe(ngHtml2Js({
        moduleName: "app.saleApp.partial",
        rename:function(url){
            url = url.replace(/\//g, '.');//replace file path '/' into '.'
            return url;
        }
    }))
    .pipe(concat("sale_app.partial.min.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('_concat_product_app_js_deploy', ['_partial_product_app'],function () {
    return gulp.src([
        '!src/app/sale_app',        
        'src/**/__init__.js',
        'bower_components/angular-block-ui/dist/angular-block-ui.js',
        'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',        
        'dist/product_app.partial.js',           
        'src/share/**/*.js', 'src/model/**/*.js','src/app/construct_app_setting.js','src/app/product_app/**/*.js', //app need share and model; model need share(util) which include filter and just toolbox; share is highest toolbox that doesn't belong to any project.
    ])
    .pipe(concat('product_app.js'))
    .pipe(rev())   
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))     
    .pipe(gulp.dest('./dist'))
})

gulp.task('_concat_sale_app_js_deploy', ['_partial_sale_app'],function () {
    return gulp.src([
        '!src/app/product_app',        
        'src/**/__init__.js',
        'bower_components/angular-block-ui/dist/angular-block-ui.js',
        'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',        
        'dist/sale_app.partial.js',           
        'src/share/**/*.js', 'src/model/**/*.js','src/app/construct_app_setting.js','src/app/sale_app/**/*.js', //app need share and model; model need share(util) which include filter and just toolbox; share is highest toolbox that doesn't belong to any project.
    ])
    .pipe(concat('sale_app.js'))
    .pipe(rev())   
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))     
    .pipe(gulp.dest('./dist'))
})

//concatinate pos_connect css
gulp.task('_concat_css',function(){
    return gulp.src([
        'css/**/*.css',
        'bower_components/angular-block-ui/dist/angular-block-ui.css'
    ])
    .pipe(concat('pos_connect.css'))
    .pipe(rev())    
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))          
    .pipe(gulp.dest('./dist'))
})

gulp.task('build_sale_app_local', ['_partial_sale_app'],function () {
    var target = gulp.src('./../templates/sale_app.html');
    var sources = gulp.src([
        './bower_components/angular-block-ui/dist/angular-block-ui.js',
        './bower_components/angular-block-ui/dist/angular-block-ui.css',
        './bower_components/angular-hotkeys/build/hotkeys.css',
        './bower_components/angular-hotkeys/build/hotkeys.js',
        './bower_components/pouchdb/dist/pouchdb.js',
        './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',        
        'src/**/__init__.js',
        'src/**/*.js',
        'dist/sale_app.partial.min.js',        
        'css/**/*.css',        
        '!src/app/product_app/**/*.*'        
    ], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/local'))
});

gulp.task('build_product_app_local', ['_partial_product_app'],function () {
    var target = gulp.src('./../templates/product_app.html');
    var sources = gulp.src([
        './bower_components/angular-block-ui/dist/angular-block-ui.js',
        './bower_components/angular-block-ui/dist/angular-block-ui.css',
        './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'src/**/__init__.js',
        'src/**/*.js',
        'dist/product_app.partial.js',        
        'css/**/*.css',        
        '!src/app/sale_app/**/*.*'        
    ], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/local'))
});

gulp.task('_inject_resource_to_product_html_deploy', function () {
    var target = gulp.src('./../templates/product_app.html');
    var sources = gulp.src([
        './dist/pos_connect-*.min.css',
        './dist/product_app-*.min.js',
    ], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/deploy'))
});

gulp.task('_inject_resource_to_sale_html_deploy', function () {
    var target = gulp.src('./../templates/sale_app.html');
    var sources = gulp.src([
        './dist/pos_connect-*.min.css',
        './dist/sale_app-*.min.js',
    ], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/deploy'))
});

gulp.task('_cdnizer_product_app',function(){
    return gulp.src("./../templates/dist/deploy/product_app.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap.min.css'
            },      
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap-theme.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap-theme.min.css'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular/angular.js',
                package: 'angular',
                test: 'window.angular',
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
            },
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jQuery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                package: 'angular-bootstrap',
                // test: 'xxx',
                cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/${ version }/ui-bootstrap-tpls.min.js'
            },        
        ]))
        .pipe(gulp.dest("./../templates/dist/deploy"));    
})

gulp.task('_cdnizer_sale_app',function(){
    return gulp.src("./../templates/dist/deploy/sale_app.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap.min.css'
            },      
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap-theme.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap-theme.min.css'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular/angular.js',
                package: 'angular',
                test: 'window.angular',
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
            },
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jQuery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                package: 'angular-bootstrap',
                // test: 'xxx',
                cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/${ version }/ui-bootstrap-tpls.min.js'
            },        
        ]))
        .pipe(gulp.dest("./../templates/dist/deploy"));    
})

gulp.task('_cdnizer_login_page',function(){
    return gulp.src("./../templates/login.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap.min.css'
            },      
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap-theme.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap-theme.min.css'
            },             
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jQuery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/js/bootstrap.js',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/js/bootstrap.min.js'
            }         
        ]))
        .pipe(gulp.dest("./../templates/dist"));            
});
gulp.task('_clean', function () {
    return del.sync(
        [
            'dist',
            './../templates/dist'
        ], 
        {force:true}
    );
});
gulp.task('build_deploy',function(cb) {
    runSequence(
        '_clean',
        ['_concat_product_app_js_deploy', '_concat_sale_app_js_deploy', '_concat_css'],
        ['_inject_resource_to_product_html_deploy','_inject_resource_to_sale_html_deploy'],
        ['_cdnizer_product_app', '_cdnizer_sale_app', '_cdnizer_login_page'],
        cb
    );
}); 
gulp.task('upload_s3', function() {
    var publisher = awspublish.create({ bucket: 'pos-connect-test' });
    var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
    return gulp.src('./dist/*.min.*')
        .pipe(publisher.publish(headers))// publisher will add Content-Length, Content-Type and headers specified above If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.cache())// create a cache file to speed up consecutive uploads
        .pipe(awspublish.reporter());// print upload updates to console
});
gulp.task('watch',['watch_product_app','watch_sale_app']);
gulp.task('watch_product_app',['build_product_app_local'],function () {
    gulp.watch([
        'css/**/*.css',
        'src/**/*.js',
        'src/**/*.html',
        '!src/app/sale_app/**/*.*',
        './../templates/product_app.html'
    ],
    ['build_product_app_local']);
});
gulp.task('watch_sale_app',['build_sale_app_local'],function () {
    gulp.watch([
        'css/**/*.css',
        'src/**/*.js',
        'src/**/*.html',
        '!src/app/product_app/**/*.*',
        './../templates/sale_app.html'
    ],
    ['build_sale_app_local']);
});
gulp.task('dev', function(){
    var django_process = process.spawn;
    var PIPE = {stdio: 'inherit'};
    django_process('foreman', ['start','--procfile','./../Procfile_local','--env','./../.env'], PIPE);

    var couchdb_process = process.spawn;
    var PIPE = {stdio: 'inherit'};
    couchdb_process('couchdb', [], PIPE);    
});

