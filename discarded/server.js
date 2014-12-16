String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs"),
mimeTypes = {
    "": "text/plain",
    "html": "text/html",
    "txt": "text/plain",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};
mainFileExt = ".html",
port = "8080";

function getPath(request){
	var my_path = url.parse(request).pathname;
	return path.join(process.cwd(),my_path);
}

function servePage(request,response){
	var full_path = getPath(request.url);
	var mimeType;
	var pathExt;
	try{
		var pathArr = path.extname(full_path).split(".");
		pathExt = (pathArr.length > 1) ? pathArr[1] : "";
		mimeType = mimeTypes[pathExt];
	}catch(err){
		sys.puts("Unable to determine mimetype, ", err.message);
		mimeType = mimeTypes["txt"];
	}
	if(pathExt === ""){
		full_path += mainFileExt;
	}
	sys.puts("");
	sys.puts("MIMETYPE of: " + mimeType);
	path.exists(full_path,function(exists){
		if(!exists){
			response.writeHeader(404, {"Content-Type": mimeTypes["txt"]});  
			response.write("404 Not Found\n");  
			response.end();
		}
		else{
			try {
				var file = processFile(full_path);
				response.writeHeader(200, {"Content-Type": mimeType});
				response.write(file, "utf-8");
				response.end();
			}
			catch(err){
				sys.puts(err.message);
				response.writeHeader(500, {"Content-Type": mimeTypes["txt"]});  
				response.write("500 Internal Server Error\nProblem: " + err.message);  
				response.end();
			}
		}
	});
}

function processFile(relative_path){
	sys.puts("Requesting Path: " + relative_path);
	var file = filesys.readFileSync(relative_path, "utf-8");
	var arr = file.match(/(<ssp:.+?>).+?(<\/ssp:.+?>)/gi);
	if(!arr) arr = [];
	var tags = {};
	for(var i=0; i<arr.length; i++){
		var obj = parseObjectTag(arr[i]);
		tags[obj.type+":"+obj.src] = obj;
	}
	for(var property in tags){
		if(tags.hasOwnProperty(property)){
			var obj = tags[property];
			if(obj != null && obj["type"] === "html"){
				var innerFile = processFile(obj["full_path"]);
				file = file.replaceAll(obj["tag"],innerFile,true);
			}
		}
	}
	return file;
}

function parseObjectTag(tag){
	/* sys.puts("tag: " + tag); */
	var str = tag.replace(/(<ssp:.+?>)|(<\/ssp:html>)/gi,"");
	/* sys.puts("tagstr: " + str); */
	var obj = JSON.parse(str);
	/* sys.puts(JSON.stringify(obj)); */
	obj["tag"] = tag;
	obj["type"] = tag.replace(/(<ssp:|>.*)/gi,"");
	/* sys.puts("type: " + obj.type); */
	/* sys.puts("src: " + obj.type); */
	obj["full_path"] = getPath(obj.src);
	/* sys.puts("path: " + obj.full_path); */
	return obj;
}
	
my_http.createServer(servePage).listen(port);
sys.puts("Server Running on " + port);