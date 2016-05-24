/// <reference path="typings/index.d.ts" />

var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var typedoc = require("gulp-typedoc");
var jasmine = require("gulp-jasmine");

gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("dist"));
});

gulp.task("typedoc", function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Riichi Mahjong"
        }))
    ;
});

gulp.task("test", function() {
    return gulp
        .src([
            "test/test-tile.js"
        ])
        .pipe(jasmine())
});

gulp.task("watch", function() {
    gulp.watch("src/**/*.ts", ["tsc", "typedoc"]);
})

gulp.task("default", ["tsc", "typedoc", "test"]);