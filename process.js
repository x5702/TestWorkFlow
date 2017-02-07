const fs = require('fs');
const readline = require('readline');

var file = fs.createReadStream("file1.txt");
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

fs.unlinkSync("file2.txt");
rl.on('line', function(line){
	if (!error)
	{
		var matches = line.match("^(.+)\t\t(.+)\t\t(.+)$");
		//console.log("Insert item: " + matches[1] + " - " + matches[2] + " - " + matches[3]);
		threadid = parseInt(matches[1]);
		previewimg = matches[2];
		threadtitle = matches[3];
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

			if (!newthreadtitle.includes("アンソロジー") && !newthreadtitle.includes("Anthology") && !newthreadtitle.includes("フルカラー成人版"))
			{
				var author = newthreadtitle.match(/\[.+\]/);
				if(author)
				{
					author = author[0];
				}

				fs.appendFileSync("file2.txt", threadid + "\t\t" + previewimg + "\t\t" + threadtitle_backup + "\t\t" + newthreadtitle + "\t\t" + author + "\r\n");
			}	
		}
	}
}).on('close', function(){

});

