/*jslint node: true*/

"use strict";
var fastChunkString = require('@shelf/fast-chunk-string');
var through2 = require('through2');
var path = require("path");
var File = require('vinyl');

var gSplitFiles = function(options /*{fileCount, fileSize} */){

    var splitFiles = {
        fileNameRegExpObj: {
            start: "\\/\\*splitfilename=",
            end: "\\*\\/",
            filename: "([\\w\\.\\-\\@]+)"
        },
        getFileNameRegExp: function () {
            var fnreo = splitFiles.fileNameRegExpObj;

            return new RegExp(fnreo.start + fnreo.filename + fnreo.end, "g");
        },
        removeNewFileNameFromFileContent: function (newFileContent) {
            var fileNameRegExp = splitFiles.getFileNameRegExp();

            return newFileContent.replace(fileNameRegExp, "").trim();
        },
        removeNewFileNameComment: function (fileNameStr) {
            var fnreo = splitFiles.fileNameRegExpObj,
                removeNewFileNameCommentRe = new RegExp("(" + fnreo.start + "|" + fnreo.end + ")", "g");

            return fileNameStr.replace(removeNewFileNameCommentRe, "");
        },
        getNewFileName: function (newFileContent) {
            var fileNameRegExp = splitFiles.getFileNameRegExp(),
                checkFileName = newFileContent.match(fileNameRegExp);

            return checkFileName ? splitFiles.removeNewFileNameComment(checkFileName.join()).trim() : "";
        },
        getFileBasePath: function (file) {
            return path.basename(file.path);
        },
        getFileNameByIndex: function (file, index) {
            var fileTypeRe = /\.[a-zA-Z1-9]+$/g,
                filePath = splitFiles.getFileBasePath(file),
                fileType = filePath.match(fileTypeRe).join(),
                fileName = filePath.replace(fileTypeRe, "");

            return fileName + "-" + (index + 1) + fileType;
        },
        getFilePath: function (file, index, newFileContent) {
            return splitFiles.getNewFileName(newFileContent) || splitFiles.getFileNameByIndex(file, index);
        },
        getCreateFileOptions: function (file, index, newFileContent, trimmedNewFileContent) {
            return {
                path: splitFiles.getFilePath(file, index, newFileContent),
                contents: new Buffer(trimmedNewFileContent)
            };
        },
        createNewFile: function (stream, file, newFileContent, index) {
            var trimmedNewFileContent = splitFiles.removeNewFileNameFromFileContent(newFileContent),
                createFileOptions = splitFiles.getCreateFileOptions(file, index, newFileContent, trimmedNewFileContent);

            stream.push(new File(createFileOptions));
        },
        createNewFiles: function (stream, file, newFiles) {
            newFiles.forEach(function (newFileContent, index) {
                splitFiles.createNewFile(stream, file, newFileContent, index);
            });  
        },
        actions: {
            pass: function (stream, file) {
                stream.push(file);
            },
            split: function (stream, file, newFiles) {
                splitFiles.createNewFiles(stream, file, newFiles);
            }
        },
        run:function(file, encoding, callback){
            var opts = options || {};
            var contents = file.contents.toString(encoding);
            var stream = this;
            var newFiles = [];
            //default behavior: use file contents to determine split
            if(typeof options === 'undefined'){
                newFiles = contents.split("/*split*/");
            }
            // split by fileSize with no more than filecount number of files (last file used as leftover)
            else if(typeof opts.fileCount !== 'undefined' && typeof opts.fileSize !== 'undefined'){
                var newFilesTemp = fastChunkString(contents, {size: opts.fileSize, unicodeAware: true});
                if(newFilesTemp.length > opts.fileCount){
                    var lastFile = "";
                    var lastFileIndex = opts.fileCount - 1;
    
                    for(var i = 0; i< lastFileIndex; i++){
                        newFiles.push(newFilesTemp[i]);
                    }
    
                    for(var i = lastFileIndex; i< newFilesTemp.length; i++){
                        lastFile = lastFile + newFilesTemp[i];
                    }
                    newFiles.push(lastFile);
                }
                else{
                    newFiles = newFilesTemp;
                }
            }
            // split by fileSize with however many number of files it takes
            else if(typeof opts.fileSize !== 'undefined'){
                newFiles = fastChunkString(contents, {size: opts.fileSize, unicodeAware: true});
            }
            // split into number of files ignoring fileSize (equal file sizes)
            else if(typeof opts.fileCount !== 'undefined'){
                newFiles = fastChunkString(contents, {size: contents.length/opts.fileCount, unicodeAware: true});
            }
            else{
                throw "invalid options";
            }

            var action = (newFiles.length === 1) ? 'pass' : 'split';
            splitFiles.actions[action](stream, file, newFiles);
            callback();

        }
    }
    return through2.obj(splitFiles.run);

}

module.exports = gSplitFiles;