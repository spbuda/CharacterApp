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
    "css": "text/css"};
	
my_http.createServer(function(request,response){
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(),my_path);
	sys.puts("");
	sys.puts("Requesting Path: " + full_path);
	var mimeType = mimeTypes[path.extname(full_path).split(".")[1]];
	sys.puts("With MIMETYPE of: " + mimeType);
	path.exists(full_path,function(exists){
		if(!exists){
			response.writeHeader(404, {"Content-Type": "text/plain"});  
			response.write("404 Not Found\n");  
			response.end();
		}
		else{
			filesys.readFile(full_path, "binary", function(err, file) {  
			     if(err) {
			         response.writeHeader(500, {"Content-Type": "text/plain"});  
			         response.write(err + "\n");  
			         response.end();  
			   
			     }  
				 else{
					response.writeHeader(200, {"Content-Type": mimeType});  
			        response.write(file, "binary");  
			        response.end();
				}
					 
			});
		}
	});
}).listen(8080);
sys.puts("Server Running on 8080");