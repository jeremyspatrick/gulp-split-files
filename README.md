# gulp-split-files
A gulp plugin for manually splitting a set of files into even more files.

## Use

**superMegaBigCss.css content:**
<pre>
´
 [lots of css stuff]
 /*split*/
 [lots more css stuff]
 /*split*/
 [even more css stuff]
´
</pre>

**In your gulpfile:**
<pre>
´
var gulp = require("gulp"),
    splitFiles = require("gulp-split-files");

    gulp.task("split", function () {
    	return gulp.src("superMegaBigCss.css")
    		.pipe(splitFiles())
    		.pipe(gulp.dest("path/to/dest"));
    });
´
</pre>

This will produce three files:
* superMegaBigCss-0.css
* superMegaBigCss-1.css
* superMegaBigCss-2.css


## Name the new files
<pre>
´
 /*splitfilename=first.css*/
 [lots of css stuff]
 /*split*/
 /*splitfilename=second.css*/
 [lots more css stuff]
´
</pre>

This will produce two files:
* first.css
* second.css

<pre>
´
/*splitfilename=first.css*/
[lots of css stuff]
 /*split*/
 [lots more css stuff]
 /*split*/
 /*splitfilename=third.css*/
 [even more css stuff]
´
</pre>

This will produce three files:
* first.css
* superMegaBigCss-1.css
* third.css
