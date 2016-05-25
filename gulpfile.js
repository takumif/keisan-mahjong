/// <reference path="typings/index.d.ts" />

var gulp = require("gulp");
var ts = require("gulp-typescript");
var typedoc = require("gulp-typedoc");
var jasmine = require("gulp-jasmine");
var merge = require("merge2");

gulp.task("build", function () {
    var tsProject = ts.createProject("tsconfig.json", { declaration: true });
    var tsResult = tsProject
        .src()
        .pipe(ts(tsProject));
    merge([
        tsResult.dts.pipe(gulp.dest("dist")),
        tsResult.js.pipe(gulp.dest("dist"))
    ]);
});

gulp.task("typedoc", function() {
    gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Riichi Mahjong"
        }));
});

gulp.task("test", function() {
    setTimeout(() => {
        gulp
            .src([
                "test/test-hand.js",
                "test/test-meld.js",
                "test/test-parser.js",
                "test/test-tile.js",
                "test/test-yaku.js"
            ])
            .pipe(jasmine());
    }, 100);
});

gulp.task("watch", function() {
    gulp.watch("src/**/*.ts", ["build", "typedoc"]);
})

gulp.task("default", ["build", "test"]);
gulp.task("all", ["build", "typedoc", "test"]);