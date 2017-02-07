const fs = require('fs');
const readline = require('readline');
const sqlite3 = require('sqlite3');

var file = fs.createReadStream("file.txt");
var rl = readline.createInterface(file, {});

//db.run("CREATE TABLE IF NOT EXISTS manga (
//	threadid INT PRIMARY KEY, 
//	threadtitle TEXT, 
//	previewimg TEXT)");

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

function SearchFile(str, callback)
{
	var db = new sqlite3.Database('news.db');
	var searchresult = "";

	var stmt = db.prepare("SELECT filename, fullpath FROM file WHERE filename LIKE ?");
	stmt.each("%"+str+"%", function(err, row) {
		searchresult = searchresult + row.filename + "<br/>\r\n";
	}, function(err, rows){
		stmt.finalize();
		callback(searchresult);
	});
}

//if (path.existsSync("new.html"))
{ 
	fs.unlinkSync("new.html");
}
fs.appendFileSync("new.html", "<table border=1>");
rl.on('line', function(line){
	if (!error)
	{
		var matches = line.match("^(.+)\t\t(.+)\t\t(.+)$");
		//console.log("Insert item: " + matches[1] + " - " + matches[2] + " - " + matches[3]);
		var threadid = parseInt(matches[1]);
		var previewimg = matches[2];
		var threadtitle = matches[3];
		if (isNaN(threadid))
		{
			console.error("Wrong thread id.");
			error = true;
		}
		else
		{
			var threadtitle_backup = threadtitle;

			//Hardcode fix for special cases
			var keywords1 = [
				"[DL版/ ]",
				"[/COLOR]",
				"[LOW QUALITY / LOW-RES]",
				"[LOW QUALITY / LOW RESOLUTION]",
				"[HQ/MQ/LQ]",
			];

			for(var i = 0; i < keywords1.length; i++)
			{
				threadtitle = RemoveKeyword(threadtitle, keywords1[i]);
			}
			//End hardcode

			var keywords2 = [
				"DL版",
				"(Own Scan)",
				"成年コミック",
				"【2017】",
				"【2016】",
				"<S>",
				"(ALT SCAN)",
				"(alt scan)",
				"*ALTERNATIVE SCAN*",
				"*NEW*",
				"＊新＊",
				"*自炊*",
				"[NEW]",
				"[New]",
				"|NEW|",
				"(Digital)",
				"[Digital]",
				"[HQ]",
				"(HQ)",
				"(High Quality)",
				"無修正",
				"別スキャン",
				"\t",
				" ",
				"[]",
				"()",
			];
			for(var i = 0; i < keywords2.length; i++)
			{
				threadtitle = RemoveKeyword(threadtitle, keywords2[i]);
			}
			threadtitle = threadtitle.trim();

			var newthreadtitle = threadtitle;
			if(threadtitle.includes("/"))
			{
				var parts = threadtitle.split("/");
				if (parts.length > 2)
				{
					//console.log("Title contains invalid character: " + threadtitle);
				}
				else
				{
					index1 = parts[0].trim().search("^[\x00-\x7Féō－＃―〜–～²³♂⇔♀！!“”☆‘’●⁯⁯■⁯⁯【】♥♥♡★○❤♪×…・·･：。℃、]+$");
					index2 = parts[1].trim().search("^[\x00-\x7Féō－＃―〜–～²³♂⇔♀！!“”☆‘’●⁯■⁯【】♥♥♡★○❤♪×…・·･：。℃、]+$");
					if (index1 >= 0)
					{
						if (index2 >= 0)
						{
							//console.log("Both titles are alphabetic: " + threadtitle);
							newthreadtitle = parts[0].trim();
						}
						else
						{
							newthreadtitle = parts[1].trim();
						}
					}
					else
					{
						if (index2 >= 0)
						{
							newthreadtitle = parts[0].trim();
						}
						else
						{
							//console.log("Both titles are non-alphabetic: " + threadtitle);
						}
					}
				}
			}

			var newthreadtitle_back = newthreadtitle
			if (newthreadtitle_back.indexOf("[") != newthreadtitle_back.lastIndexOf("["))
			{
				var parts0 = newthreadtitle_back.substr(0, newthreadtitle_back.lastIndexOf("[")-1);
				var parts1 = newthreadtitle_back.substr(newthreadtitle_back.lastIndexOf("["));
				{
					index1 = parts0.trim().search("^[\x00-\x7Féō－＃―〜–～²³♂⇔♀！!“”☆‘’●⁯⁯■⁯⁯【】♥♥♡★○❤♪×…・·･：。℃、]+$");
					index2 = parts1.trim().search("^[\x00-\x7Féō－＃―〜–～²³♂⇔♀！!“”☆‘’●⁯■⁯【】♥♥♡★○❤♪×…・·･：。℃、]+$");
					if (index1 >= 0)
					{
						if (index2 >= 0)
						{
							//console.log("Both titles are alphabetic: " + newthreadtitle_back);
							newthreadtitle = parts0.trim();
						}
						else
						{
							newthreadtitle = parts1.trim();
						}
					}
					else
					{
						if (index2 >= 0)
						{
							newthreadtitle = parts0.trim();
						}
						else
						{
							//console.log("Both titles are non-alphabetic: " + newthreadtitle_back);
						}
					}
				}
			}

			var author = newthreadtitle.match(/\[.+\]/);
			if(author)
			{
				author = author[0];
			}

			previewimg = previewimg.replace("class=\"preview\"", "height=200");
			if (author && author != "[雑誌]" && author != "[アンソロジー]")
			{
				SearchFile(author, function(result) {
					fs.appendFileSync("new.html", "<tr><td rowspan=3>" + previewimg + "</td>\r\n");
					fs.appendFileSync("new.html", "<td>" + threadtitle_backup + "</td></tr>\r\n");
					fs.appendFileSync("new.html", "<tr><td>" + newthreadtitle + "</td></tr>\r\n");
					fs.appendFileSync("new.html", "<tr><td>" + result + "</td></tr>\r\n");
				})
			}
			else
			{
				SearchFile("sdfkjaljflafjlawefjlafjlaewfjlaw", function(result) {
					fs.appendFileSync("new.html", "<tr><td rowspan=3>" + previewimg + "</td>\r\n");
					fs.appendFileSync("new.html", "<td>" + threadtitle_backup + "</td></tr>\r\n");
					fs.appendFileSync("new.html", "<tr><td>" + newthreadtitle + "</td></tr>\r\n");
					fs.appendFileSync("new.html", "<tr><td></td></tr>\r\n");
				})
			}
		}
	}
}).on('close', function(){
	//fs.appendFileSync("new.html", "</table>");
});

