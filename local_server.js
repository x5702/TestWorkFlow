const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer(function(req, res) {
	if (req.url == "/favicon.ico")
	{
		return;
	}

	var query = url.parse(req.url, true).query;
	if (query && query.op == "add")
	{
		console.log(query);
		if (query.p)
		{
			fs.closeSync(fs.openSync(query.p, 'a'));
		}
		else
		{
			console.log("Invalid file name");
		}
	}
	else if (query && query.op == "discard")
	{
		console.log(query);
		if (query.p)
		{
			//remove corresponding database entry
			var db = new sqlite3.Database('news.db');
			var stmt = db.prepare("DELETE FROM news WHERE threadid = ?");
			stmt.run(query.p, function() {
				db.close();
			});
			stmt.finalize();
		}
		else
		{
			console.log("Invalid thread id");
		}
	}
	else
	{
		//show the whole page
	}

	res.writeHead(200, {"Content-Type": "text/plain"});
  res.end('Hello World\n');
});

//server.on('clientError', (err, socket) => {
//  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
//});

server.listen(8000, "127.0.0.1");