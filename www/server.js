var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs"),
mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"},
port = 8081,
fallback = true,
fallbackPath = "index.html";

my_http.createServer(function(request,response){
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(),my_path);
	sys.puts("");
	sys.puts("Requesting Path: " + full_path);
	var mimeType = mimeTypes[path.extname(full_path).split(".")[1]];
	sys.puts("With MIMETYPE of: " + mimeType);
	filesys.exists(full_path,function(exists){
		if(!exists && !fallback){
			response.writeHeader(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
		}
		else if(!exists && fallback){
			filesys.readFile(fallbackPath, "binary", function(err, file) {
				try{
					response.writeHeader(200, {"Content-Type": mimeTypes["html"]});
					response.write(file, "binary");
					response.end();
				}
				catch(e){
					console.log(e);
					if(response != null)
						response.end();
				}
			});
		}
		else{
			filesys.readFile(full_path, "binary", function(err, file) {
			     if(err) {
			         response.writeHeader(500, {"Content-Type": "text/plain"});
			         response.write(err + "\n");
			         response.end();

			     }
				 else{
					try{
						response.writeHeader(200, {"Content-Type": mimeType});
						response.write(file, "binary");
						response.end();
					}
					catch(e){
						console.log(e);
						if(response != null)
							response.end();
					}
				}

			});
		}
	});
}).listen(port);
sys.puts("Server Running on " + port);