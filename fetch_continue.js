var config = require("./config.js");
const http = require('http');
const fs = require('fs');
var jsdom = require('jsdom');

var findend = false;
var startindex = 1;
var latestthread = 0;
var newlatestthread = 0;

function ParseAPage(id)
{
	var url = "http://www.anime-sharing.com/forum/hentai-manga-32/index" + id + ".html?prefixid=japanese&sort=dateline&order=desc&daysprune=-1";
	if (id == 1)
	{
		url = "http://www.anime-sharing.com/forum/hentai-manga-32/?pp=50&daysprune=-1&sort=dateline&prefixid=japanese&order=desc";
	}

	jsdom.env(
		url,
		["http://code.jquery.com/jquery.js"],
		function (err, window) {
			console.log("Parsing Page: " + id);
			if (err)
			{
				console.log(err + "---" + id);
			}
			else
			{
				window.$("div.threadinfo").each(function(){
					var title = window.$("a[id^='thread_title_']", this);
					var threadid = parseInt(title.attr("id").match("[0-9]+$"));
					if (isNaN(threadid))
					{
						console.error("something went wrong!!");
					}
					else if (threadid > latestthread)
					{
						fs.appendFileSync("file.txt", threadid + "\t\t");
						fs.appendFileSync("file.txt", window.$(this).html().match("<img class=\"preview\" src=\"[^\"]+\"") + ">\t\t");
						fs.appendFileSync("file.txt", title.text() + "\r\n");

						if (threadid > newlatestthread)
						{
							newlatestthread = threadid;
							fs.writeFileSync("latestthreadid.txt", newlatestthread.toString());
						}
					}
					else
					{
						findend = true;
					}
				});

				id = id + 1;
				fs.writeFileSync("lastpageid.txt", id.toString());
			}
			if (!findend)
			{
				ParseAPage(id);
			}
		});
}

startindex = parseInt(fs.readFileSync("lastpageid.txt"));
latestthread = parseInt(fs.readFileSync("latestthreadid.txt"));
newlatestthread = latestthread;

if (isNaN(startindex))
{
	console.error("Wrong page id.");
}
else if (isNaN(latestthread))
{
	console.error("Wrong thread id.");
}
else
{
	ParseAPage(startindex);
}