const fs = require('fs');
const sqlite3 = require('sqlite3');
const readline = require('readline');

var db = new sqlite3.Database('news.db');
var threadid;
var threadtitle;
var previewimg;
var count = 1;
var error = false;

function insert()
{
	db.run("begin transaction");

	var file = fs.createReadStream("file2.txt");
	var rl = readline.createInterface(file, {});
	rl.on('line', function(line){
		if (!error)
		{
			var matches = line.match("^(.+)\t\t(.+)\t\t(.+)\t\t(.+)\t\t(.+)$");
			//console.log("Insert item: " + matches[1] + " - " + matches[2] + " - " + matches[3] + " - " + matches[4]);
			threadid = parseInt(matches[1]);
			if (isNaN(threadid))
			{
				console.error("Wrong thread id.");
				error = true;
			}
			else
			{
				var stmt = db.prepare("INSERT INTO manga (threadid, threadtitle, previewimg, realtitle, author) VALUES (?, ?, ?, ?, ?)");
				stmt.run(threadid, matches[3], matches[2], matches[4], matches[5]);
				stmt.finalize();
			}
		}
	}).on('close', function(){
		db.run("commit");
	});
}

db.run("DROP TABLE IF EXISTS manga", callback = function(){
	db.run("CREATE TABLE IF NOT EXISTS manga ( \
		threadid INTEGER PRIMARY KEY ON CONFLICT IGNORE, \
		threadtitle TEXT UNIQUE ON CONFLICT IGNORE, \
		previewimg TEXT UNIQUE ON CONFLICT IGNORE, \
		realtitle TEXT UNIQUE ON CONFLICT IGNORE, \
		author TEXT, \
		title TEXT)", callback = insert);
});

