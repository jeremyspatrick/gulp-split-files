# gulp-split-files
A gulp plugin for splitting a file by count, by size or by logic inside the file 

## Use

**Options**
fileSize: number in bytes
fileCount: number

**Examples:**
```js
const gulp = require("gulp");
const splitFiles = require("gulp-split-files");

//creates 15 files of equal size (last file with the remainder)
gulp.task("split", function () {
    return gulp.src("superMegaBigCss.css")
    .pipe(splitFiles({fileCount: 15}))
    .pipe(gulp.dest("path/to/dest"));
});

//divides the file into 150k chunks with as many files as necessary
gulp.task("split", function () {
    return gulp.src("superMegaBigCss.css")
    .pipe(splitFiles({fileSize: 1500000}))
    .pipe(gulp.dest("path/to/dest"));
});

//divides the file into 150k chunks with a maximum of 15 files. The 15th file will contain
//the remainder of the bytes
gulp.task("split", function () {
    return gulp.src("superMegaBigCss.css")
    .pipe(splitFiles({fileSize: 1500000, fileCount: 15}))
    .pipe(gulp.dest("path/to/dest"));
});


//passing no arguments will analyze the file for internal logic for how to split the file. Details below.
gulp.task("split", function () {
    return gulp.src("superMegaBigCss.css")
    .pipe(splitFiles())
    .pipe(gulp.dest("path/to/dest"));
});
```

**superMegaBigCss.css content:**
```css
[lots of css stuff]
/*split*/
[lots more css stuff]
/*split*/
[even more css stuff]
```

**In your gulpfile:**
```js
const gulp = require("gulp");
const splitFiles = require("gulp-split-files");

gulp.task("split", function () {
    return gulp.src("superMegaBigCss.css")
    .pipe(splitFiles())
    .pipe(gulp.dest("path/to/dest"));
});
```

This will produce three files:
* superMegaBigCss-0.css
* superMegaBigCss-1.css
* superMegaBigCss-2.css


## Name the new files
```css
/*splitfilename=first.css*/
[lots of css stuff]
/*split*/
/*splitfilename=second.css*/
[lots more css stuff]
```

This will produce two files:
* first.css
* second.css

```css
/*splitfilename=first.css*/
[lots of css stuff]
/*split*/
[lots more css stuff]
/*split*/
/*splitfilename=third.css*/
[even more css stuff]
```

This will produce three files:
* first.css
* superMegaBigCss-1.css
* third.css
