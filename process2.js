const fs = require('fs');
const readline = require('readline');

var file = fs.createReadStream("manga-author.html");
var rl = readline.createInterface(file, {});

//db.run("CREATE TABLE IF NOT EXISTS manga (
//	threadid INT PRIMARY KEY, 
//	threadtitle TEXT, 
//	previewimg TEXT)");

var threadid;
var threadtitle;
var previewimg;
var count = 1;
var error = false;

function RemoveKeyword(str, keyword)
{
	while (str.includes(keyword))
	{
		str = str.replace(keyword, "");
	}
	return str;
}

fs.unlinkSync("author2.html");
fs.appendFileSync("author2.html", "<table>\r\n");
rl.on('line', function(line){
	if (!error)
	{
		var matches = line.match("^(.+)\t\t(.+)\t\t(.+)$");
		//console.log("Insert item: " + matches[1] + " - " + matches[2] + " - " + matches[3]);
		threadid = parseInt(matches[1]);
		previewimg = matches[2];
		threadtitle = matches[3];
		fs.appendFileSync("author2.html", "<tr><td>" + previewimg + "</td><td>" + threadtitle + "</td></tr>\r\n");
	}
}).on('close', function(){
	fs.appendFileSync("author2.html", "</table>\r\n");
});

