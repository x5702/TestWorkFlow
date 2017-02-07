const fs = require('fs');
const sqlite3 = require('sqlite3');
const readline = require('readline');

var db = new sqlite3.Database('news.db');
var error = false;

function insert()
{
	db.run("begin transaction");
	
	var file = fs.createReadStream("all.txt");
	var rl = readline.createInterface(file, {});
	rl.on('line', function(line){
		if (!error)
		{
			var fullpath = line.match("\"(.+)\"");
			if (fullpath)
			{
				fullpath = fullpath[1];
				var filename = fullpath.substr(fullpath.lastIndexOf("\\")+1);
				var stmt = db.prepare("INSERT INTO file (filename, fullpath) VALUES (?, ?)");
				stmt.run(filename, fullpath);
				stmt.finalize();
			}
		}
	}).on('close', function(){
		db.run("commit");
	});
}

db.run("DROP TABLE IF EXISTS file", callback = function(){
	db.run("CREATE TABLE IF NOT EXISTS file ( \
		id INTEGER PRIMARY KEY AUTOINCREMENT, \
		filename TEXT, \
		fullpath TEXT UNIQUE ON CONFLICT ABORT)", callback = insert);
});

