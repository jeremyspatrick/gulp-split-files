/*jslint node: true*/
/*global describe, it, before*/

"use strict";

var splitFiles = require("../"),

    es = require('event-stream'),
    path = require("path"),
    File = require('vinyl'),
    assert = require("assert"),
    expect = require("chai").expect,

    testUtil = {
        createFakeFile: function (fileName, fileContent) {
            return new File({
                path: fileName,
                contents: new Buffer(fileContent)
            });
        }
    };

describe("Simple split", function () {

    var testFile = "testfile1",
        fileName = testFile + ".txt",
        fileContent = "first/*split*/second",
        newfileNames = [testFile + "-0.txt", testFile + "-1.txt"],
        fileCount = 0,
        fileStream = fileContent.split("/*split*/");

    describe("Should split the file '" + fileName + "' in two", function () {
        it("should deliver a file stream containing two files (" + newfileNames.join(" & ") + ")", function (done) {

            var fakeFile = testUtil.createFakeFile(fileName, fileContent),
                split1 = splitFiles();

            split1.write(fakeFile);

            split1.on("data", function (file) {
                var filename = path.basename(file.path);

                assert(file.isBuffer());
                assert.equal(filename, newfileNames[fileCount]);
                assert.equal(file.contents.toString('utf8'), fileStream[fileCount]);

                fileCount += 1;

                if (fileCount === fileStream.length) {
                    done();
                }
            });
        });
    });

});