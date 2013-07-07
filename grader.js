#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var util = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var getUrl = require('restler');
var URL_DEFAULT = "http://evening-plateau-7685.herokuapp.com"; //my url
var HTMLFILE_TEMPFILE = "temp_file.html";
var HTMLFILE_DEFAULT = "temp_file.html";
var CHECKSFILE_DEFAULT = "checks.json";

//add url support

var assertUrlExists = function(url) {
    
    var response2console = buildfn(HTMLFILE_TEMPFILE);
    
    getUrl.get(url).on('complete', response2console);
    
    return response2console;
};

var buildfn = function(htmlfile) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: Can not read url');
            return assertFileExists("error_url");
        } else {
            //console.error("Wrote %s", htmlfile);
            fs.writeFileSync(htmlfile, result);
            url2console(htmlfile, CHECKSFILE_DEFAULT);
        }
    };
    return response2console;
};

var url2console = function(file, checks) {
    var checkJson = checkHtmlFile(file, checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};

//final url 
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'url to save to temp_file.html', clone(assertUrlExists), URL_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    
    var CheckUrl=false;
    // print process.argv
	process.argv.forEach(function(val, index, array) {
  		if (val=="-u" || val=="--url") {
  			//console.log("tem url");
  			CheckUrl=true;
  		}
	});
    
 
    if (CheckUrl==false) {
    
     	var checkJson = checkHtmlFile(program.file, program.checks);
    	var outJson = JSON.stringify(checkJson, null, 4);
    	console.log(outJson);
    }
      
   } else {
    exports.checkHtmlFile = checkHtmlFile;
}
