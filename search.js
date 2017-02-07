const sqlite3 = require('sqlite3');

function SearchFile(str)
{
	var db = new sqlite3.Database('news.db');

	var stmt = db.prepare("SELECT filename, fullpath FROM file WHERE filename LIKE ?");
	stmt.each("%"+str+"%", function(err, row) {
		console.log(row.filename + "  " + row.fullpath);
	});
	stmt.finalize();
}

SearchFile("中乃空");