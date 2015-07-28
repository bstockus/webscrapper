var cheerio = require('cheerio');
var fs = require('fs');

function processDivs(rootDivs, level) {

    var csvLine = "";
    
    $(rootDivs).each(function (index, $childDiv) {
	var attrs = "";
	if ($($childDiv).children('span').first().children('.unpub').length == 0) {
	    var line = "";
	    for (var spaces = 0; spaces < level; spaces ++) {
		line += "  ";
		csvLine += ",";
	    }
	    var splits = $('a', $childDiv).first().attr('onmouseover').split(',');
	    var title = splits[2].replace("'", "").replace("'", "").replace('\n','');
	    var children = $($childDiv).children('div');
	    line += title + ": " + children.length + "(" + attrs + ")";
	    csvLine += title + "\n";
	    console.log(line);
	    //console.dir(splits);
	    if (children.length > 0) {
		csvLine += processDivs(children, level + 1);
	    }
	}
    });
    return csvLine;
}

console.log("Reading File...");
var html = fs.readFileSync('./index.html');

var $ = cheerio.load(html);

var $rootDivs = $(".root");

var results = "";

results = processDivs($rootDivs, 0);

console.log(results);

fs.writeFileSync('./results.csv', results);
