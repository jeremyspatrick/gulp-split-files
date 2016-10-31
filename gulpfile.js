/*jslint node: true */

"use strict";

var gulp = require("gulp"),
    rimraf = require("gulp-rimraf"),
    splitFiles = require("./index"),
    cccp = require("gulp-cccp"),

    cccpConfig = {
        platoDir: "./platoReport",
        checkFixSrc: [
            "**/*.js",
            "**/*.json",
            "!node_modules/**",
            "!platoReport/**"
        ],
        complexityCheck: ["*.js"]
    },
    gulpTasks = {
        run: function (tasksArray) {
            console.log(tasksArray);

            return gulp.start(tasksArray);
        }
    };

cccp(cccpConfig);

gulp.task("default", ["cccp"]);

module.exports = gulpTasks;